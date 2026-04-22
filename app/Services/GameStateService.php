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
    protected $resourceService;

    public function __construct(ResourceService $resourceService)
    {
        $this->resourceService = $resourceService;
    }

    /**
     * Retorna o estado completo de uma aldeia.
     */
    public function getVillageState(int $villageId): array
    {
        // 1. Carregamento de dados (Read-Only) com falha explícita
        $base = Base::with([
            'recursos', 
            'edificios.type', 
            'units.type'
        ])->find($villageId);

        if (!$base) {
            throw new \Exception("SITUAÇÃO CRÍTICA: O setor militar #{$villageId} não foi localizado no mapa estratégico.");
        }

        if (!$base->recursos) {
            throw new \Exception("CORRUPÇÃO DE DADOS: O setor #{$villageId} está operacional mas não possui registos económicos (Recursos NULL).");
        }

        // 2. Cálculo de Recursos (SSOT Económico)
        $now = GameClock::now();
        $productionRates = $this->resourceService->getRates($base);
        $resources = $this->resourceService->calculate($base->recursos, $now, $productionRates);

        if (empty($resources)) {
            throw new \Exception("FALHA DE CÁLCULO: O motor económico falhou ao projetar os recursos para o setor #{$villageId}.");
        }

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

        $base->makeHidden(['recursos', 'jogador']); // Evitar recursão e duplicidade no SSOT

        $state = [
            '_debug' => true,
            '_village' => $base,
            '_resources' => $resources,
            '_buildings' => $base->edificios,
            'jogador' => $base->jogador,
            'base' => $base,
            'bases' => $base->jogador->bases,
            'resources' => $resources,
            'production' => $productionRates,
            'buildings' => $base->edificios,
            'buildQueue' => $buildQueue,
            'unitQueue' => $unitQueue,
            'units' => $base->units,
            'movements' => $movements,
            'timestamp' => $now->toIso8601String(),
        ];

        return $state;
    }
}
