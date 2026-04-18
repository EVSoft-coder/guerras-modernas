<?php

namespace App\Services;

use App\Models\Base;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * GameEngine - Motor de Estado Soberano (FASE HARDEN FINAL).
 * Orquestra todas as tabelas de domínio em ciclos atómicos.
 */
class GameEngine
{
    protected $buildingQueueService;
    protected $unitQueueService;
    protected $resourceService;
    protected $movementService;
    protected $timeService;
    protected $integrityService;
    protected $loyaltyService;

    public function __construct(
        ?BuildingQueueService $buildingQueueService = null,
        ?UnitQueueService $unitQueueService = null,
        ?ResourceService $resourceService = null,
        ?MovementService $movementService = null,
        ?TimeService $timeService = null,
        ?QueueIntegrityService $integrityService = null,
        ?LoyaltyService $loyaltyService = null
    ) {
        $this->timeService = $timeService ?? new TimeService();
        $this->buildingQueueService = $buildingQueueService ?? new BuildingQueueService($this->timeService);
        $this->unitQueueService = $unitQueueService ?? new UnitQueueService($this->timeService);
        $this->resourceService = $resourceService ?? new ResourceService($this->timeService);
        $this->movementService = $movementService ?? new MovementService(new MapService());
        $this->integrityService = $integrityService ?? new QueueIntegrityService();
        $this->loyaltyService = $loyaltyService ?? new LoyaltyService();
    }

    /**
     * Ponto de entrada estático para o processamento da base.
     */
    public static function process(Base $base): void
    {
        app(self::class)->processBase($base);
    }

    /**
     * Orquestração Global do Estado da Base.
     * Implementa o bloqueio pessimista para evitar race conditions.
     */
    public function processBase(Base $base): void
    {
        // PASSO 1 — LOCK TIMEOUT + RETRY (Fase Harden 3): 5 tentativas automáticas
        DB::transaction(function () use ($base) {
            // 1. Lock Global da Base
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();
            if (!$lockedBase) return;

            // 2. Sync de Recursos e Lealdade (Tribal)
            $this->resourceService->sync($lockedBase);
            $this->loyaltyService->updateLoyalty($lockedBase);

            // 3. Auditoria e Reparação de Integridade
            $this->integrityService->validateAndRepair($lockedBase);

            // 4. Processar Filas
            $this->buildingQueueService->processQueue($lockedBase);
            $this->unitQueueService->processQueue($lockedBase);

            // 5. Processar Movimentos
            $this->movementService->processMovements($lockedBase);

            // 6. Sync Final (Estado Final)
            $this->resourceService->sync($lockedBase);
            
            Log::channel('game')->info("[GAME_ENGINE] Ciclo atómico finalizado para base {$base->id}");
        }, 5);
    }
}
