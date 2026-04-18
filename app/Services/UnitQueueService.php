<?php

namespace App\Services;

use App\Models\Base;
use App\Models\UnitType;
use App\Models\UnitQueue;
use App\Models\MovementUnit;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * UnitQueueService - Mobilização em Escala (PASSO 1 — FASE HARDEN 3).
 * Gere recrutamento com suporte a retries e consistência atómica.
 */
class UnitQueueService
{
    private TimeService $timeService;

    public function __construct(TimeService $timeService)
    {
        $this->timeService = $timeService;
    }

    public function startRecruitment(Base $base, int $unitTypeId, int $quantidade)
    {
        return DB::transaction(function() use ($base, $unitTypeId, $quantidade) {
            $unitType = UnitType::findOrFail($unitTypeId);
            
            // Lock Resources
            $rec = $base->recursos()->lockForUpdate()->first();
            
            // Calcular custos baseados no EconomyService (Fase 14)
            $economy = app(EconomyService::class);
            $buildingLevel = (new GameService($this->timeService))->obterNivelEdificio($base, $unitType->building_type);
            
            // FÓRMULA ECONOMY: Custo escala com nível do edifício produtor
            $costs = $economy->getUnitCost($unitType->name, $buildingLevel);
            $durationPerUnit = $economy->getUnitTime($unitType->name, $buildingLevel);

            $totalCosts = [];
            foreach ($costs as $res => $val) {
                $totalCosts[$res] = $val * $quantidade;
                if ((float)$rec->{$res} < $totalCosts[$res]) {
                    throw new \Exception("LOGÍSTICA: " . strtoupper($res) . " insuficientes para mobilização.");
                }
            }

            // Deduzir Recursos
            foreach ($totalCosts as $res => $amount) {
                if ($amount > 0) $rec->decrement($res, $amount);
            }

            $costPerUnit = $costs['suprimentos'] ?? 0;

            $lastPos = DB::table('unit_queue')->where('base_id', $base->id)->max('position') ?? 0;
            
            $id = DB::table('unit_queue')->insertGetId([
                'base_id' => $base->id,
                'unit_type_id' => $unitTypeId,
                'quantity' => $quantidade,
                'quantity_remaining' => $quantidade,
                'units_produced' => 0,
                'duration_per_unit' => $durationPerUnit,
                'cost_suprimentos' => $costPerUnit,
                'cost_combustivel' => $unitType->base_cost_combustivel,
                'cost_municoes' => $unitType->base_cost_municoes,
                'position' => $lastPos + 1,
                'status' => ($lastPos + 1) === 1 ? 'active' : 'pending',
                'started_at' => ($lastPos + 1) === 1 ? GameClock::now() : null,
                'created_at' => GameClock::now(),
                'updated_at' => GameClock::now()
            ]);

            Log::channel('game')->info('[UNIT_ENQUEUED]', ['id' => $id, 'qty' => $quantidade]);

            return $id;
        }, 5);
    }

    public function processQueue(Base $base)
    {
        $now = GameClock::now();
        
        DB::transaction(function() use ($base, $now) {
            $active = DB::table('unit_queue')
                ->where('base_id', $base->id)
                ->where('position', 1)
                ->whereNull('cancelled_at')
                ->lockForUpdate()
                ->first();

            if (!$active) {
                $this->refreshQueue($base->id);
                return;
            }

            $startedAt = Carbon::parse($active->started_at);
            $elapsed = $now->diffInSeconds($startedAt);
            
            $totalShouldBeProduced = floor($elapsed / $active->duration_per_unit);
            $newUnits = $totalShouldBeProduced - ($active->units_produced ?? 0);
            
            $actualToProduce = min((int)$newUnits, $active->quantity_remaining);

            if ($actualToProduce > 0) {
                $this->addUnitsToBase($base, $active->unit_type_id, $actualToProduce);
                
                $newQuantityRemaining = $active->quantity_remaining - $actualToProduce;
                $newUnitsProduced = ($active->units_produced ?? 0) + $actualToProduce;
                
                if ($newQuantityRemaining <= 0) {
                    DB::table('unit_queue')->where('id', $active->id)->delete();
                } else {
                    DB::table('unit_queue')->where('id', $active->id)->update([
                        'quantity_remaining' => $newQuantityRemaining,
                        'units_produced' => $newUnitsProduced,
                        'updated_at' => $now
                    ]);
                }
                
                if ($newQuantityRemaining <= 0) {
                    $this->refreshQueue($base->id);
                }
            }
        }, 5);
    }

    public function cancelRecruitment(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = DB::table('unit_queue')->where('id', $queueId)->lockForUpdate()->first();
            if (!$item) return false;

            $baseId = $item->base_id;
            $base = Base::find($baseId);
            $rec = $base->recursos()->lockForUpdate()->first();

            $qtyRemaining = (int) $item->quantity_remaining;
            
            $rec->increment('suprimentos', (float) ($item->cost_suprimentos * $qtyRemaining));
            $rec->increment('combustivel', (float) ($item->cost_combustivel * $qtyRemaining));
            $rec->increment('municoes',    (float) ($item->cost_municoes * $qtyRemaining));

            DB::table('unit_queue')->where('id', $item->id)->delete();
            $this->refreshQueue($baseId);

            return true;
        }, 5);
    }

    private function addUnitsToBase(Base $base, int $unitTypeId, int $quantity)
    {
        $unitName = UnitType::find($unitTypeId)->name;
        \App\Models\Tropas::updateOrCreate(
            ['base_id' => $base->id, 'unidade' => $unitName],
            ['quantidade' => DB::raw("quantidade + {$quantity}")]
        );
    }

    private function refreshQueue(int $baseId)
    {
        $items = DB::table('unit_queue')
            ->where('base_id', $baseId)
            ->orderBy('position', 'asc')
            ->get();

        $now = GameClock::now();
        $pos = 1;

        foreach ($items as $item) {
            $update = ['position' => $pos, 'updated_at' => $now];
            
            if ($pos === 1 && $item->status !== 'active') {
                $update['status'] = 'active';
                $update['started_at'] = $now;
                $update['finishes_at'] = $now->copy()->addSeconds($item->quantity_remaining * $item->duration_per_unit);
            }
            DB::table('unit_queue')->where('id', $item->id)->update($update);
            $pos++;
        }
    }

    public function moveUp(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = DB::table('unit_queue')->where('id', $queueId)->lockForUpdate()->first();
            if (!$item || $item->position <= 1) return false;

            $prev = DB::table('unit_queue')->where('base_id', $item->base_id)->where('position', $item->position - 1)->first();
            if ($prev) {
                DB::table('unit_queue')->where('id', $prev->id)->update(['position' => $item->position, 'status' => 'pending', 'started_at' => null, 'finishes_at' => null]);
                DB::table('unit_queue')->where('id', $item->id)->update(['position' => $item->position - 1]);
                $this->refreshQueue($item->base_id);
            }
            return true;
        }, 5);
    }

    public function moveDown(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = DB::table('unit_queue')->where('id', $queueId)->lockForUpdate()->first();
            if (!$item) return false;

            $next = DB::table('unit_queue')->where('base_id', $item->base_id)->where('position', $item->position + 1)->first();
            if ($next) {
                DB::table('unit_queue')->where('id', $next->id)->update(['position' => $item->position]);
                DB::table('unit_queue')->where('id', $item->id)->update(['position' => $item->position + 1, 'status' => 'pending', 'started_at' => null, 'finishes_at' => null]);
                $this->refreshQueue($item->base_id);
            }
            return true;
        }, 5);
    }
}
