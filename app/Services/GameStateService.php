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
    protected $researchService;

    public function __construct(ResourceService $resourceService, ?ResearchService $researchService = null)
    {
        $this->resourceService = $resourceService;
        $this->researchService = $researchService ?? app(ResearchService::class);
    }

    /**
     * Retorna o estado completo de uma aldeia.
     */
    public function getVillageState(int $villageId): array
    {
        // 1. Carregamento de dados (Read-Only) com falha explícita
        $base = Base::with([
            'recursos', 
            'edificios', 
            'units.type',
            'buildingQueue',
            'unitQueue',
            'jogador.bases'
        ])->find($villageId);

        if (!$base) {
            throw new \Exception("SITUAÇÃO CRÍTICA: O setor militar #{$villageId} não foi localizado no mapa estratégico.");
        }

        // 2. Cálculo de Recursos (SSOT Económico)
        $resources = $this->resourceService->calculateResources($base);

        // 3. Obter dados auxiliares para a UI
        $jogador = $base->jogador;
        $unitTypes = \App\Models\UnitType::all();
        $config = config('game');

        // 4. Serialização determinística para o Frontend (Snapshot Único)
        return [
            'jogador' => $jogador ? [
                'id' => $jogador->id,
                'username' => $jogador->username,
                'name' => $jogador->username, // Fallback para compatibilidade
            ] : null,
            'base' => $base->only(['id', 'nome', 'coordenada_x', 'coordenada_y', 'ultimo_update', 'loyalty']),
            'bases' => $jogador ? $jogador->bases->map(fn($b) => ['id' => $b->id, 'nome' => $b->nome]) : [],
            'buildings' => $base->edificios->map(fn($b) => [
                'id' => $b->id,
                'tipo' => $b->tipo,
                'nivel' => $b->nivel,
                'pos_x' => $b->pos_x,
                'pos_y' => $b->pos_y,
            ]),
            'units' => $base->units->map(fn($u) => [
                'typeId' => $u->unit_type_id,
                'name' => $u->type->name,
                'quantity' => $u->quantity,
            ]),
            'unitTypes' => $unitTypes,
            'buildingQueue' => $base->buildingQueue,
            'unitQueue' => $base->unitQueue,
            'resources' => $resources,
            'taxas' => $this->resourceService->getRates($base),
            'ataquesEnviados' => Movement::where('origin_id', $base->id)->where('status', 'moving')->get(),
            'ataquesRecebidos' => Movement::where('target_id', $base->id)->where('status', 'moving')->get(),
            'research' => $jogador ? $this->researchService->getResearchState($jogador, $base) : null,
            'researchBonuses' => $jogador ? $this->researchService->getResearchBonuses($jogador) : [],
            'gameConfig' => $config,
            'researchConfig' => config('research'),
        ];
    }
}
