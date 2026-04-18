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

    public function __construct(
        ?BuildingQueueService $buildingQueueService = null,
        ?UnitQueueService $unitQueueService = null,
        ?ResourceService $resourceService = null,
        ?MovementService $movementService = null,
        ?TimeService $timeService = null,
        ?QueueIntegrityService $integrityService = null
    ) {
        $this->timeService = $timeService ?? new TimeService();
        $this->buildingQueueService = $buildingQueueService ?? new BuildingQueueService($this->timeService);
        $this->unitQueueService = $unitQueueService ?? new UnitQueueService($this->timeService);
        $this->resourceService = $resourceService ?? new ResourceService($this->timeService);
        $this->movementService = $movementService ?? new MovementService(new MapService());
        $this->integrityService = $integrityService ?? new QueueIntegrityService();
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
        DB::transaction(function () use ($base) {
            // 1. Lock Global da Base (Passo 3 — LOCKS)
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();
            if (!$lockedBase) return;

            // 2. Sincronização Inicial de Recursos (Passo 6 — RESOURCES)
            // Essencial antes de processar filas para ter o saldo exato para transições
            $this->resourceService->sync($lockedBase);

            // 3. Auditoria de Integridade (Passo 4 — FASE HARDEN 2)
            $this->integrityService->validateAndRepair($lockedBase);

            // 4. Processar Fila de Construção (Passo 4 — BUILDING QUEUE)
            $this->buildingQueueService->processQueue($lockedBase);

            // 5. Processar Fila de Unidades (Passo 5 — UNIT QUEUE)
            $this->unitQueueService->processQueue($lockedBase);

            // 6. Processar Movimentos Militares (Passo 9 — MOVEMENT)
            // Inclui combate, loot e conquistas
            $this->movementService->processMovements($lockedBase);

            // 7. Sincronização Final de Recursos
            // Captura qualquer produção extra ou looting resultante deste ciclo
            $this->resourceService->sync($lockedBase);
            
            Log::channel('game')->info("[GAME_ENGINE] Base {$base->id} processada com sucesso atómico.");
        });
    }
}
