<?php

namespace App\Services;

use App\Models\Base;
use App\Models\UnitQueue;
use App\Models\Unit;
use App\Models\UnitType;
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
     * Inicia o recrutamento de uma unidade.
     * PASSO 3 - startRecruitment
     */
    public function startRecruitment(Base $base, int $unitTypeId, int $quantity)
    {
        return DB::transaction(function() use ($base, $unitTypeId, $quantity) {
            // 1. Sincronizar Recursos para garantir base de cálculo real (Audit 1.0)
            app(ResourceService::class)->sync($base);

            // 2. Validar Recursos e Tipo
            $unitType = UnitType::findOrFail($unitTypeId);
            $totalCostSuprimentos = $unitType->cost_suprimentos * $quantity;
            $totalCostMunicoes = $unitType->cost_municoes * $quantity;
            $totalCostCombustivel = $unitType->cost_combustivel * $quantity;

            // Bloquear se já existir queue ativa
            $activeQueue = UnitQueue::where('base_id', $base->id)->exists();
            if ($activeQueue) {
                throw new \Exception("LOGÍSTICA: O quartel já está processando ordens. Aguarde a conclusão.");
            }

            // Lock resources for update
            $recursos = $base->recursos()->lockForUpdate()->first();
            if ($recursos->suprimentos < $totalCostSuprimentos || 
                $recursos->municoes < $totalCostMunicoes || 
                $recursos->combustivel < $totalCostCombustivel) {
                throw new \Exception("Suprimentos insuficientes para mobilização.");
            }

            // 2. Calcular tempo: build_time * quantity (PASSO 3)
            $totalTime = $unitType->build_time * $quantity;
            $now = $this->timeService->now();

            // 3. Deduzir recursos (PASSO 3)
            $recursos->decrement('suprimentos', $totalCostSuprimentos);
            $recursos->decrement('municoes', $totalCostMunicoes);
            $recursos->decrement('combustivel', $totalCostCombustivel);

            Log::info('[RECRUIT_START]', ['base_id' => $base->id, 'unit' => $unitType->name, 'qty' => $quantity]);

            // 4. Inserir na queue (PASSO 3)
            return UnitQueue::create([
                'base_id' => $base->id,
                'unit_type_id' => $unitTypeId,
                'quantity' => $quantity,
                'started_at' => $now,
                'finishes_at' => $now->copy()->addSeconds($totalTime),
            ]);
        });
    }

    /**
     * Processa a fila de recrutamento.
     * PASSO 3 - processQueue
     */
    public function process(Base $base)
    {
        $now = $this->timeService->now();

        // PASSO 4 — DB::transaction + lockForUpdate
        $pendingQueues = UnitQueue::where('base_id', $base->id)
            ->where('finishes_at', '<=', $now->addSeconds(2))
            ->lockForUpdate()
            ->get();

        if ($pendingQueues->isEmpty()) return;

        DB::transaction(function() use ($base, $pendingQueues) {
            foreach ($pendingQueues as $queue) {
                // Adicionar unidades (PASSO 3)
                $unit = Unit::firstOrCreate(
                    ['base_id' => $base->id, 'unit_type_id' => $queue->unit_type_id]
                );
                $unit->increment('quantity', $queue->quantity);

                Log::info('[RECRUIT_FINISHED]', ['base_id' => $base->id, 'unit_type_id' => $queue->unit_type_id, 'qty' => $queue->quantity]);

                // Remover da queue
                $queue->delete();
            }
        });
    }
}
