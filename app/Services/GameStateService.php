<?php

namespace App\Services;

use App\Models\Base;
use App\Models\BuildingQueue;
use App\Models\UnitQueue;
use App\Models\Movement;
use Illuminate\Support\Facades\Log;

/**
 * GameStateService - Single Source of Truth (Fase CORE).
 * Fornece um snapshot imutável do estado da base para o frontend.
 * REGRAS: Apenas leitura, sem escrita em base de dados.
 */
class GameStateService
{
    protected $gameService;

    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }

    /**
     * Retorna o estado completo de uma aldeia.
     */
    public function getVillageState(int $villageId): array
    {
        // 1. Carregamento de dados (Read-Only)
        // Usamos eager loading para evitar N+1
        $base = Base::with([
            'recursos', 
            'edificios.type', 
            'units.type'
        ])->findOrFail($villageId);

        // 2. Cálculo de Recursos (SSOT - Sem persistência)
        $now = GameClock::now();
        $resources = $this->gameService->calculateResources($base, $now);
        $productionRates = $this->gameService->obterTaxasProducao($base);

        // 3. Filas de Produção
        $buildQueue = BuildingQueue::where('base_id', $villageId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->get();

        $unitQueue = UnitQueue::with('unitType')
            ->where('base_id', $villageId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->get();

        // 4. Movimentos de Tropas (Entrada e Saída)
        $movements = Movement::with(['units.type', 'origin.jogador', 'target.jogador'])
            ->where(function ($query) use ($villageId) {
                $query->where('origin_id', $villageId)
                      ->orWhere('target_id', $villageId);
            })
            ->where('status', 'moving')
            ->orderBy('arrival_time', 'asc')
            ->get();

        $state = [
            'resources' => $resources,
            'productionRates' => $productionRates,
            'buildings' => $base->edificios,
            'buildQueue' => $buildQueue,
            'unitQueue' => $unitQueue,
            'units' => $base->units,
            'movements' => $movements,
            'timestamp' => $now->toIso8601String(),
        ];

        Log::channel('game')->debug("[GAME_STATE_SNAPSHOT] Snapshot gerado para base #{$villageId}");

        return $state;
    }
}
