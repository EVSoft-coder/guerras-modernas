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
            
            // 1. Calcular bónus de tempo (infraestrutura militar)
            $speedBonus = 1.0; // Padrão
            $durationPerUnit = (int) ($unitType->build_time / $speedBonus);
            $totalDuration = $durationPerUnit * $quantidade;

            // 2. Calcular custos totais
            $custoTotal = [
                'suprimentos' => $unitType->cost_suprimentos * $quantidade,
                'combustivel' => $unitType->cost_combustivel * $quantidade,
                'municoes'    => $unitType->cost_municoes * $quantidade,
            ];

            // 3. Validar e Consumir (Fase Crítica)
            $gameService = new GameService($this->timeService);
            if (!$gameService->consumirRecursos($base, $custoTotal)) {
                throw new \Exception("LOGÍSTICA: Recursos insuficientes para mobilização em massa.");
            }

            // 4. Determinar posição na fila de treino
            $lastPos = UnitQueue::where('base_id', $base->id)->max('position') ?? 0;
            $position = $lastPos + 1;

            $now = $this->timeService->now();

            $queue = UnitQueue::create([
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
                'cost_suprimentos'  => $unitType->cost_suprimentos, // Guardamos o custo UNITÁRIO para reembolso
                'cost_combustivel'  => $unitType->cost_combustivel,
                'cost_municoes'     => $unitType->cost_municoes,
            ]);

            Log::channel('game')->info('[UNIT_ENQUEUED]', ['id' => $queue->id, 'type' => $unitType->name, 'qty' => $quantidade]);

            return $queue;
        });
    }

    /**
     * Processa o recrutamento da base com entregas parciais.
     */
    public function processQueue(Base $base)
    {
        $now = $this->timeService->now();
        
        DB::transaction(function() use ($base, $now) {
            $active = UnitQueue::where('base_id', $base->id)
                ->where('position', 1)
                ->lockForUpdate()
                ->first();

            if (!$active) {
                $this->refreshQueue($base->id);
                return;
            }

            $elapsed = $now->diffInSeconds($active->started_at);
            
            // Calcular quantas unidades foram produzidas neste intervalo
            $unitsProduced = floor($elapsed / $active->duration_per_unit);
            
            // Garantir que não entregamos mais do que o pedido original
            $actualProduced = min((int)$unitsProduced, $active->quantity_remaining);

            if ($actualProduced > 0) {
                $this->addUnitsToBase($base, $active->unit_type_id, $actualProduced);
                
                $active->quantity_remaining -= $actualProduced;
                $active->started_at = $active->started_at->addSeconds($actualProduced * $active->duration_per_unit);
                
                Log::channel('game')->info('[UNITS_PRODUCED_PARTIAL]', [
                    'base_id' => $base->id,
                    'type_id' => $active->unit_type_id,
                    'qty' => $actualProduced,
                    'remaining' => $active->quantity_remaining
                ]);
            }

            if ($active->quantity_remaining <= 0) {
                $active->delete();
                $this->refreshQueue($base->id);
            } else {
                $active->save();
            }
        });
    }

    /**
     * Cancela o recrutamento e reembolsa as unidades não produzidas.
     */
    public function cancelRecruitment(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = UnitQueue::where('id', $queueId)->lockForUpdate()->first();
            if (!$item || $item->position !== 1) {
                 throw new \Exception("LOGÍSTICA: Apenas a produção ativa pode ser cancelada/abortada.");
            }

            $base = Base::find($item->base_id);
            $rec = $base->recursos;
            
            // Reembolsar o que ainda não foi produzido
            $qtyToRefund = $item->quantity_remaining;
            $rec->increment('suprimentos', $item->cost_suprimentos * $qtyToRefund);
            $rec->increment('combustivel', $item->cost_combustivel * $qtyToRefund);
            $rec->increment('municoes', $item->cost_municoes * $qtyToRefund);

            $item->delete();
            $this->refreshQueue($base->id);

            Log::channel('game')->info('[UNIT_RECRUITMENT_CANCELLED]', ['base_id' => $base->id, 'refund_qty' => $qtyToRefund]);

            return true;
        });
    }

    /**
     * Adiciona unidades fisicamente à base ou guarnição.
     */
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

    /**
     * Sincroniza posições e ativa o próximo item.
     */
    private function refreshQueue(int $baseId)
    {
        $items = UnitQueue::where('base_id', $baseId)
            ->orderBy('position', 'asc')
            ->get();

        $now = $this->timeService->now();
        $pos = 1;

        foreach ($items as $item) {
            $item->position = $pos;
            
            if ($pos === 1 && $item->status !== 'active') {
                $item->status = 'active';
                $item->started_at = $now;
                $item->finishes_at = $now->copy()->addSeconds($item->quantity_remaining * $item->duration_per_unit);
            } else if ($pos > 1) {
                // Garantir que itens em espera não têm tempos "lixo"
                $item->status = 'pending';
                $item->started_at = null;
                $item->finishes_at = null;
            }

            $item->save();
            $pos++;
        }
    }

    public function moveUp(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = UnitQueue::where('id', $queueId)->lockForUpdate()->first();
            if (!$item || $item->position <= 1) return false;

            $prev = UnitQueue::where('base_id', $item->base_id)->where('position', $item->position - 1)->first();
            if ($prev) {
                $prev->position = $item->position;
                $prev->status = 'pending';
                $prev->started_at = null;
                $prev->finishes_at = null;
                $prev->save();

                $item->position = $item->position - 1;
                $item->save();

                $this->refreshQueue($item->base_id);
            }
            return true;
        });
    }

    public function moveDown(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = UnitQueue::where('id', $queueId)->lockForUpdate()->first();
            if (!$item) return false;

            $next = UnitQueue::where('base_id', $item->base_id)->where('position', $item->position + 1)->first();
            if ($next) {
                $next->position = $item->position;
                $next->save();

                $item->position = $item->position + 1;
                $item->status = 'pending';
                $item->started_at = null;
                $item->finishes_at = null;
                $item->save();

                $this->refreshQueue($item->base_id);
            }
            return true;
        });
    }
}
