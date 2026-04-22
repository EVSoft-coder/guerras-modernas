<?php

namespace App\Services;

use App\Models\Base;
use App\Models\UnitType;
use App\Models\UnitQueue;
use App\Models\Unit;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * UnitQueueService - Modelo Determinístico de Batelada (FASE QUEUE V19.7).
 * Unidades são criadas no inventário moderno (Unit) após a conclusão.
 */
class UnitQueueService
{
    private TimeService $timeService;

    public function __construct(TimeService $timeService)
    {
        $this->timeService = $timeService;
    }

    /**
     * Iniciar recrutamento: Valida, debita e enfileira com cronometragem real.
     */
    public function startRecruitment(Base $base, int $unitTypeId, int $quantidade)
    {
        return DB::transaction(function() use ($base, $unitTypeId, $quantidade) {
            $unitType = UnitType::findOrFail($unitTypeId);
            
            // 1. Lock e Sync de Recursos (Mutação Crítica)
            app(ResourceService::class)->sync($base);
            $rec = $base->recursos()->lockForUpdate()->first();
            
            // 2. Cálculo de Custos (Sincronizado com EconomyService)
            $economy = app(EconomyService::class);
            $buildingLevel = (new GameService($this->timeService))->obterNivelEdificio($base, $unitType->building_type);
            
            $costs = $economy->getUnitCost($unitType->name, $buildingLevel);
            $durationPerUnit = $economy->getUnitTime($unitType->name, $buildingLevel);

            $totalCosts = [];
            foreach ($costs as $res => $val) {
                $totalCosts[$res] = $val * $quantidade;
                if ((float)$rec->{$res} < $totalCosts[$res]) {
                    throw new \Exception("LOGÍSTICA: " . strtoupper($res) . " insuficientes para mobilização.");
                }
            }

            // 3. Débito Transacional
            foreach ($totalCosts as $res => $amount) {
                if ($amount > 0) $rec->decrement($res, $amount);
            }

            // 4. Determinação de Cronograma (Encadeamento)
            $lastItem = DB::table('unit_queue')
                ->where('base_id', $base->id)
                ->orderBy('position', 'desc')
                ->first();

            $startedAt = $lastItem ? Carbon::parse($lastItem->finishes_at) : GameClock::now();
            $totalDuration = $quantidade * $durationPerUnit;
            $finishesAt = $startedAt->copy()->addSeconds($totalDuration);
            $lastPos = $lastItem ? $lastItem->position : 0;

            // 5. Inserção na Fila via Eloquent (Garante retorno do Objeto)
            $queueItem = UnitQueue::create([
                'base_id' => $base->id,
                'unit_type_id' => $unitTypeId,
                'quantity' => $quantidade, // Batch size
                'quantity_remaining' => $quantidade,
                'units_produced' => 0,
                'duration_per_unit' => $durationPerUnit,
                'cost_suprimentos' => $costs['suprimentos'] ?? 0,
                'cost_combustivel' => $costs['combustivel'] ?? 0,
                'cost_municoes' => $costs['municoes'] ?? 0,
                'position' => $lastPos + 1,
                'status' => 'pending',
                'started_at' => $startedAt,
                'finishes_at' => $finishesAt,
            ]);

            Log::channel('game')->info("[GAME_ENGINE] RECRUIT_START {$base->id}", [
                'unit_type_id' => $unitTypeId,
                'quantity' => $quantidade,
                'queue_id' => $queueItem->id
            ]);

            return $queueItem;
        }, 5);
    }

    /**
     * Processamento Determinístico: Liberta lotes concluídos.
     */
    public function processQueue(Base $base)
    {
        $now = GameClock::now();
        
        DB::transaction(function() use ($base, $now) {
            // Unidades concluídas: finishes_at <= AGORA
            $completed = DB::table('unit_queue')
                ->where('base_id', $base->id)
                ->where('finishes_at', '<=', $now)
                ->orderBy('position', 'asc')
                ->lockForUpdate()
                ->get();

            if ($completed->isEmpty()) return;

            $lastCompletedAt = null;
            foreach ($completed as $item) {
                // Adicionar unidades concluídas à base (Inventário Moderno)
                $this->addUnitsToBase($base, $item->unit_type_id, $item->quantity);
                
                // Remover lote da fila
                DB::table('unit_queue')->where('id', $item->id)->delete();
                
                $lastCompletedAt = $item->finishes_at;
                Log::channel('game')->info("[GAME_ENGINE] RECRUIT_FINISH {$base->id}", [
                    'unit_type_id' => $item->unit_type_id,
                    'quantity' => $item->quantity
                ]);
            }

            // Recalcular tempos para as unidades pendentes remanescentes começando do fim do último lote
            $this->refreshQueue($base->id, $lastCompletedAt);
        }, 5);
    }

    /**
     * Cancelar recrutamento: Reembolsa e reorganiza a fila.
     */
    public function cancelRecruitment(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = DB::table('unit_queue')->where('id', $queueId)->lockForUpdate()->first();
            if (!$item) return false;

            $baseId = $item->base_id;
            $base = Base::find($baseId);
            $rec = $base->recursos()->lockForUpdate()->first();

            // Reembolsar 100% dos recursos do lote
            $rec->increment('suprimentos', (float) ($item->cost_suprimentos * $item->quantity));
            $rec->increment('combustivel', (float) ($item->cost_combustivel * $item->quantity));
            $rec->increment('municoes',    (float) ($item->cost_municoes    * $item->quantity));

            DB::table('unit_queue')->where('id', $item->id)->delete();
            $this->refreshQueue($baseId);

            return true;
        }, 5);
    }

    /**
     * Adiciona unidades ao inventário moderno (tabela units).
     */
    private function addUnitsToBase(Base $base, int $unitTypeId, int $quantity)
    {
        // 1. Tabela Moderna (units)
        $unit = Unit::firstOrCreate(
            ['base_id' => $base->id, 'unit_type_id' => $unitTypeId],
            ['quantity' => 0]
        );
        $unit->increment('quantity', $quantity);

        // 2. Compatibilidade Legada (tropas) - Opcional, mas mantemos para evitar quebra em outras partes do sistema
        $unitType = UnitType::find($unitTypeId);
        if ($unitType) {
            \App\Models\Tropas::updateOrCreate(
                ['base_id' => $base->id, 'unidade' => $unitType->name],
                ['quantidade' => DB::raw("quantidade + {$quantity}")]
            );
        }
    }

    /**
     * Reorganizar cronograma: Encadeia novamente os tempos de started_at e finishes_at.
     */
    public function refreshQueue(int $baseId, $startTime = null)
    {
        $items = DB::table('unit_queue')
            ->where('base_id', $baseId)
            ->orderBy('position', 'asc')
            ->get();

        $now = GameClock::now();
        $currentTime = $startTime ?? $now;
        $pos = 1;

        foreach ($items as $item) {
            $totalDuration = $item->quantity * $item->duration_per_unit;
            $finishesAt = $currentTime->copy()->addSeconds($totalDuration);

            DB::table('unit_queue')->where('id', $item->id)->update([
                'position' => $pos,
                'started_at' => $currentTime,
                'finishes_at' => $finishesAt,
                'status' => $pos === 1 ? 'active' : 'pending',
                'updated_at' => $now
            ]);

            $currentTime = $finishesAt;
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
                DB::table('unit_queue')->where('id', $prev->id)->update(['position' => $item->position]);
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
                DB::table('unit_queue')->where('id', $item->id)->update(['position' => $item->position + 1]);
                $this->refreshQueue($item->base_id);
            }
            return true;
        }, 5);
    }
}
