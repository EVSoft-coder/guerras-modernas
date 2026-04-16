<?php

namespace App\Application;

use App\Models\Base;
use App\Services\GameService;
use App\Services\TimeService;
use Illuminate\Support\Facades\DB;

/**
 * Operação Atómica: Sincronização de Recursos.
 * Fase 2: Harden Resource Service (uso de locks e transações).
 */
class SyncResources
{
    private GameService $gameService;
    private TimeService $timeService;

    public function __construct(GameService $gameService, TimeService $timeService)
    {
        $this->gameService = $gameService;
        $this->timeService = $timeService;
    }

    public function execute(Base $base): void
    {
        // Orquestração centralizada no GameService (Fase 4 - Passo 3)
        $this->gameService->tickResources($base);
    }
}
