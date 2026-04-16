<?php

namespace App\Application;

use App\Models\Base;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Services\GameService;
use App\Services\TimeService;
use Illuminate\Support\Facades\Log;

/**
 * Operação: Obtenção de Dados para o Dashboard.
 * Remove lógica de negócio do DashboardController.
 */
class GetDashboardData
{
    private GameService $gameService;
    private TimeService $timeService;

    public function __construct(GameService $gameService, TimeService $timeService)
    {
        $this->gameService = $gameService;
        $this->timeService = $timeService;
    }

    /**
     * @param Authenticatable $user
     */
    public function execute(Authenticatable $user, ?int $selectedBaseId = null): array
    {
        $userId = $user->getAuthIdentifier();

        // 1. Obter Bases via Identificador
        $bases = Base::where('jogador_id', $userId)
            ->with(['recursos', 'edificios', 'buildingQueue', 'treinos', 'tropas'])
            ->get();
            
        $base = ($selectedBaseId) 
            ? $bases->where('id', $selectedBaseId)->first() 
            : $bases->first();

        if (!$base) {
            throw new \Exception("Base não localizada.");
        }

        // 2. Sincronizar Filas (Lógica Centralizada de Tempo)
        // PASSO 3 - INTEGRAÇÃO: Garantir processamento antes da leitura final
        $this->gameService->processarFilas($base);
        
        // Re-hidratar relações para garantir que o snapshot ignora o que foi processado
        $base->load(['recursos', 'edificios', 'buildingQueue', 'treinos', 'tropas']);

        // 3. Recursos Formatados
        $recursos = $base->recursos;
        $resources = $recursos ? [
            'id'           => $recursos->id,
            'base_id'      => $recursos->base_id,
            'suprimentos'  => (float) $recursos->suprimentos,
            'combustivel'  => (float) $recursos->combustivel,
            'municoes'     => (float) $recursos->municoes,
            'metal'        => (float) $recursos->metal,
            'energia'      => (float) $recursos->energia,
            'pessoal'      => (float) $recursos->pessoal,
            'cap'          => (int) ($recursos->cap ?? 10000),
            'updated_at'   => $recursos->updated_at,
        ] : null;

        // 3. Auxiliares
        $populacao = $this->gameService->obterEstatisticasPopulacao($base);
        $taxas = $this->gameService->obterTaxasProducao($base);
        $taxasPerSecond = collect($taxas)->map(fn($v) => (float)$v / 60)->toArray();

        // 4. Relatórios
        $relatorios = \App\Models\Relatorio::where('atacante_id', $userId)
            ->orWhere('defensor_id', $userId)
            ->latest()->take(10)->get();
            
        $relatoriosGlobal = \App\Models\Relatorio::latest()->take(10)->get();

        return [
            'jogador'          => $user,
            'base'             => $base,
            'bases'            => $bases,
            'buildings'        => $base->edificios->filter(fn($e) => $e->nivel > 0),
            'population'       => $populacao,
            'resources'        => $resources,
            'taxas'            => $taxas,
            'taxasPerSecond'   => $taxasPerSecond,
            'relatorios'       => $relatorios,
            'relatoriosGlobal' => $relatoriosGlobal,
            'gameConfig'       => config('game'),
            'buildingQueue'    => $base->buildingQueue,
            'gameData'         => [
                'resources'  => $resources,
                'units'      => $base->tropas,
                'buildings'  => $base->edificios,
                'population' => $populacao,
                'movements'  => [
                    'sent'     => \App\Models\Ataque::where('origem_base_id', $base->id)->where('processado', false)->get(),
                    'received' => \App\Models\Ataque::where('destino_base_id', $base->id)->where('processado', false)->get(),
                    'queue'    => $base->buildingQueue,
                ],
                'rebels' => Base::whereNull('jogador_id')->with('recursos')->get()->map(function($b) {
                    return array_merge($b->toArray(), [
                        'calculated_resources' => $this->gameService->calculateResources($b),
                    ]);
                }),
            ]
        ];
    }
}
