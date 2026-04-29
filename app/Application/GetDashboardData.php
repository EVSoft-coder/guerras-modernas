<?php

namespace App\Application;

use App\Models\Base;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Services\GameService;
use App\Services\TimeService;
use App\Services\UnitQueueService;
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

        // 1. Processar todas as filas (Engenharia e Mobilização) via Motor Central (Fase Crítica - Passo 2)
        \App\Services\GameEngine::process($base);

        // 2. Agora carregar os dados atualizados (Apenas as tabelas modernas)
        $base->load(['recursos', 'edificios', 'buildingQueue', 'unitQueue', 'units']);

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
            'cap'          => (int) ($recursos->storage_capacity ?? 10000),
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
            'ataquesRecebidos' => \App\Models\Movement::where('target_id', $base->id)->where('status', 'moving')->with(['origin.jogador', 'units.type'])->get(),
            'ataquesEnviados'  => \App\Models\Movement::where('origin_id', $base->id)->where('status', 'moving')->with(['target.jogador', 'units.type'])->get(),
            'gameConfig'       => config('game'),
            'buildingQueue'    => $base->buildingQueue,
            'unitQueue'        => $base->unitQueue()->with('unitType')->get(),
            'units'            => $base->units()->with('type')->get(),
            'unitTypes'        => \App\Models\UnitType::all()->map(function($ut) use ($base) {
                // Producer level (Passo 6 e 7)
                $producerType = $ut->building_type ?: \App\Domain\Building\BuildingType::QUARTEL;
                $buildingLevel = $this->gameService->obterNivelEdificio($base, $producerType);
                $economy = app(\App\Services\EconomyService::class);

                return array_merge($ut->toArray(), [
                    'cost_suprimentos' => $economy->getUnitCost($ut->name, $buildingLevel, 1, $ut->slug)['suprimentos'] ?? 0,
                    'cost_combustivel' => $economy->getUnitCost($ut->name, $buildingLevel, 1, $ut->slug)['combustivel'] ?? 0,
                    'cost_municoes'    => $economy->getUnitCost($ut->name, $buildingLevel, 1, $ut->slug)['municoes'] ?? 0,
                    'build_time'       => $economy->getUnitTime($ut->name, $buildingLevel, 1, $ut->slug)
                ]);
            }),
            'nobleInfo' => [
                'moedas' => $user->moedas,
                'capacidade' => $user->totalNobresCapacidade(),
                'emUso' => $user->nobresEmUso(),
                'disponiveis' => $user->slotsNobresDisponiveis(),
                'moedasParaProximo' => $user->moedasParaProximoNobre(),
            ],
            'diplomaties'      => $user->alianca_id ? \App\Models\AliancaDiplomacia::where('alianca_id', $user->alianca_id)->get() : [],
            'myAllianceId'     => $user->alianca_id,
            'gameData'         => [
                'resources'  => $resources,
                'units'      => $base->units,
                'buildings'  => $base->edificios,
                'population' => $populacao,
                'movements'  => [
                    'sent'     => \App\Models\Movement::where('origin_id', $base->id)->where('status', 'moving')->with(['target.jogador', 'units.type'])->get(),
                    'received' => \App\Models\Movement::where('target_id', $base->id)->where('status', 'moving')->with(['origin.jogador', 'units.type'])->get(),
                    'queue'    => $base->buildingQueue,
                    'unitQueue'=> $base->unitQueue,
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
