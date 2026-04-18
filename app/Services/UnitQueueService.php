<?php

namespace App\Services;

use App\Models\Base;
use App\Models\UnitQueue;
use App\Models\UnitType;
use App\Domain\Unit\UnitRules;
use App\Services\TimeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UnitQueueService
{
    private TimeService $timeService;

    public function __construct(?TimeService $timeService = null)
    {
        $this->timeService = $timeService ?? new TimeService();
    }

    /**
     * Inicia o recrutamento de um lote de unidades.
     */
    public function startRecruitment(Base $base, int $unitTypeId, int $quantidade)
    {
        return DB::transaction(function() use ($base, $unitTypeId, $quantidade) {
            $unitType = UnitType::findOrFail($unitTypeId);
            
            $speedBonus = 1.0; 
            $durationPerUnit = (int) ($unitType->build_time / $speedBonus);
            $totalDuration = $durationPerUnit * $quantidade;

            $custoTotal = [
                'suprimentos' => $unitType->cost_suprimentos * $quantidade,
                'combustivel' => $unitType->cost_combustivel * $quantidade,
                'municoes'    => $unitType->cost_municoes * $quantidade,
            ];

            $gameService = new GameService($this->timeService);
            if (!$gameService->consumirRecursos($base, $custoTotal)) {
                throw new \Exception("LOGÍSTICA: Recursos insuficientes para mobilização em massa.");
            }

            $lastPos = DB::table('unit_queue')->where('base_id', $base->id)->max('position') ?? 0;
            $position = $lastPos + 1;

            $now = $this->timeService->now();

            $id = DB::table('unit_queue')->insertGetId([
                'base_id'           => $base->id,
                'unit_type_id'      => $unitTypeId,
                'position'          => $position,
                'quantity'          => $quantidade,
                'quantity_remaining' => $quantidade,
                'duration_per_unit' => $durationPerUnit,
                'total_duration'    => $totalDuration,
                'status'            => $position === 1 ? 'active' : 'pending',
                'started_at'        => $position === 1 ? $now : null,
                'finishes_at'       => $position === 1 ? $now->copy()->addSeconds($totalDuration) : null,
                'cost_suprimentos'  => $unitType->cost_suprimentos,
                'cost_combustivel'  => $unitType->cost_combustivel,
                'cost_municoes'     => $unitType->cost_municoes,
                'created_at'        => $now,
                'updated_at'        => $now,
            ]);

            Log::channel('game')->info('[UNIT_ENQUEUED]', ['id' => $id, 'qty' => $quantidade]);

            return $id;
        });
    }

    /**
     * Processa o recrutamento da base com entregas parciais.
     */
    public function processQueue(Base $base)
    {
        $now = $this->timeService->now();
        
        DB::transaction(function() use ($base, $now) {
            $active = DB::table('unit_queue')
                ->where('base_id', $base->id)
                ->where('position', 1)
                ->lockForUpdate()
                ->first();

            if (!$active) {
                $this->refreshQueue($base->id);
                return;
            }

            $startedAt = \Carbon\Carbon::parse($active->started_at);
            $elapsed = $now->diffInSeconds($startedAt);
            
            $unitsProduced = floor($elapsed / $active->duration_per_unit);
            $actualProduced = min((int)$unitsProduced, $active->quantity_remaining);

            if ($actualProduced > 0) {
                $this->addUnitsToBase($base, $active->unit_type_id, $actualProduced);
                
                $newQuantityRemaining = $active->quantity_remaining - $actualProduced;
                $newStartedAt = $startedAt->addSeconds($actualProduced * $active->duration_per_unit);
                
                if ($newQuantityRemaining <= 0) {
                    DB::table('unit_queue')->where('id', $active->id)->delete();
                    $this->refreshQueue($base->id);
                } else {
                    DB::table('unit_queue')->where('id', $active->id)->update([
                        'quantity_remaining' => $newQuantityRemaining,
                        'started_at' => $newStartedAt,
                        'updated_at' => $now
                    ]);
                }

                Log::channel('game')->info('[UNITS_PRODUCED_PARTIAL]', [
                    'base_id' => $base->id,
                    'qty' => $actualProduced,
                    'remaining' => $newQuantityRemaining
                ]);
            }
        });
    }

    /**
     * Cancela o recrutamento e reembolsa as unidades não produzidas.
     */
    public function cancelRecruitment(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = DB::table('unit_queue')->where('id', $queueId)->lockForUpdate()->first();
            if (!$item || $item->position !== 1) {
                 throw new \Exception("LOGÍSTICA: Apenas a produção ativa pode ser cancelada/abortada.");
            }

            $base = Base::find($item->base_id);
            $rec = $base->recursos;
            
            $qtyToRefund = $item->quantity_remaining;
            $rec->increment('suprimentos', $item->cost_suprimentos * $qtyToRefund);
            $rec->increment('combustivel', $item->cost_combustivel * $qtyToRefund);
            $rec->increment('municoes', $item->cost_municoes * $qtyToRefund);

            DB::table('unit_queue')->where('id', $queueId)->delete();
            $this->refreshQueue($item->base_id);

            return true;
        });
    }

    private function addUnitsToBase(Base $base, int $unitTypeId, int $quantity)
    {
        $unit = $base->units()->where('unit_type_id', $unitTypeId)->first();
        if ($unit) {
            $unit->increment('quantity', $quantity);
        } else {
            $base->units()->create([
                'unit_type_id' => $unitTypeId,
                'quantity' => $quantity,
                'health' => 100
            ]);
        }
    }

    private function refreshQueue(int $baseId)
    {
        $items = DB::table('unit_queue')
            ->where('base_id', $baseId)
            ->orderBy('position', 'asc')
            ->get();

        $now = $this->timeService->now();
        $pos = 1;

        foreach ($items as $item) {
            $update = ['position' => $pos, 'updated_at' => $now];
            
            if ($pos === 1 && $item->status !== 'active') {
                $update['status'] = 'active';
                $update['started_at'] = $now;
                $update['finishes_at'] = $now->copy()->addSeconds($item->quantity_remaining * $item->duration_per_unit);
            } else if ($pos > 1) {
                $update['status'] = 'pending';
                $update['started_at'] = null;
                $update['finishes_at'] = null;
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
        });
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
        });
    }
}
