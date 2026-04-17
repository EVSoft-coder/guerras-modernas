<?php

namespace App\Services;

use App\Models\Base;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GameEngine
{
    protected $buildingQueueService;
    protected $unitQueueService;
    protected $resourceService;
    protected $timeService;

    public function __construct(
        ?BuildingQueueService $buildingQueueService = null,
        ?UnitQueueService $unitQueueService = null,
        ?ResourceService $resourceService = null,
        ?TimeService $timeService = null
    ) {
        $this->timeService = $timeService ?? new TimeService();
        $this->buildingQueueService = $buildingQueueService ?? new BuildingQueueService($this->timeService);
        $this->unitQueueService = $unitQueueService ?? new UnitQueueService($this->timeService);
        $this->resourceService = $resourceService ?? new ResourceService($this->timeService);
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
            // 1. Lock Global da Base (Fase Crítica - Passo 1)
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();
            
            if (!$lockedBase) return;

            // 2. Processar Fila de Construção
            $this->buildingQueueService->processQueue($lockedBase);

            // 3. Processar Fila de Unidades
            $this->unitQueueService->process($lockedBase);

            // 4. Sincronizar Recursos
            $this->resourceService->sync($lockedBase);
            
            Log::channel('game')->info("[GAME_ENGINE] Base {$base->id} processada com sucesso.");
        });
    }
}
