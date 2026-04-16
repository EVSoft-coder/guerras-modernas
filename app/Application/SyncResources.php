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
        DB::transaction(function() use ($base) {
            // Lock para evitar updates concorrentes (Fase 2)
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();
            
            // Sincronizar Recursos
            $this->gameService->tickResources($lockedBase);
            
            // Processar Filas
            $this->gameService->processarFilas($lockedBase);
        });
    }
}
