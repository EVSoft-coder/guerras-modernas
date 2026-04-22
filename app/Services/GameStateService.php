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

        // 2. Cálculo de Recursos (SSOT Económico) — FASE CRÍTICA — VALIDAÇÃO EXCLUSIVA
        return app(ResourceService::class)->calculateResources($base);
    }
}
