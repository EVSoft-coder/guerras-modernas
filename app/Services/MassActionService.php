<?php

namespace App\Services;

use App\Models\Jogador;
use App\Models\Base;
use App\Models\ConstructionTemplate;
use App\Models\UnitType;
use App\Models\UnitQueue;
use App\Models\BuildingQueue;
use Illuminate\Support\Facades\DB;

class MassActionService
{
    protected $resourceService;
    protected $unitQueueService;
    protected $buildingQueueService;

    public function __construct(
        ResourceService $resourceService,
        UnitQueueService $unitQueueService,
        BuildingQueueService $buildingQueueService
    ) {
        $this->resourceService = $resourceService;
        $this->unitQueueService = $unitQueueService;
        $this->buildingQueueService = $buildingQueueService;
    }

    /**
     * Recrutamento em Massa - Ordem Alfabética de Bases.
     * Recruta o máximo possível até os recursos acabarem.
     */
    public function recruitMass(Jogador $jogador, array $orders)
    {
        $bases = $jogador->bases()->with('recursos')->orderBy('nome')->get();
        $results = [];

        foreach ($bases as $base) {
            if (!isset($orders[$base->id])) continue;

            $baseOrders = $orders[$base->id];
            foreach ($baseOrders as $unitTypeId => $quantity) {
                if ($quantity <= 0) continue;

                try {
                    // CALCULAR MÁXIMO POSSÍVEL (DADO RECURSOS DA BASE)
                    $unitType = UnitType::findOrFail($unitTypeId);
                    $economy = app(EconomyService::class);
                    $gameService = new GameService(app(TimeService::class));
                    $buildingLevel = $gameService->obterNivelEdificio($base, $unitType->building_type);
                    $costsPerUnit = $economy->getUnitCost($unitType->name, $buildingLevel);
                    
                    $maxPossible = (int)$quantity;
                    $rec = $base->recursos;

                    foreach ($costsPerUnit as $res => $cost) {
                        if ($cost > 0) {
                            $possible = floor($rec->{$res} / $cost);
                            $maxPossible = min($maxPossible, $possible);
                        }
                    }

                    if ($maxPossible > 0) {
                        $this->unitQueueService->startRecruitment($base, (int)$unitTypeId, (int)$maxPossible);
                        $results[$base->id][$unitTypeId] = "success: {$maxPossible} recrutados";
                    } else {
                        $results[$base->id][$unitTypeId] = "skipped: recursos insuficientes";
                    }
                } catch (\Exception $e) {
                    $results[$base->id][$unitTypeId] = 'error: ' . $e->getMessage();
                }
            }
        }

        return $results;
    }

    /**
     * Aplicar Template - Salta passo se recursos insuficientes ou erro.
     */
    public function applyTemplate(Jogador $jogador, ConstructionTemplate $template, array $baseIds)
    {
        $bases = $jogador->bases()->whereIn('id', $baseIds)->orderBy('nome')->get();
        $results = [];

        foreach ($bases as $base) {
            foreach ($template->steps as $step) {
                // Verificar limite da fila (Máx: 5)
                $currentQueueCount = BuildingQueue::where('base_id', $base->id)->whereNull('cancelled_at')->count();
                if ($currentQueueCount >= 5) {
                    $results[$base->id][] = "Limite de fila atingido (5).";
                    break; // Pára de processar este template para esta base
                }

                $edificio = $base->edificios()->where('tipo', $step->building_type)->first();
                $currentLevel = $edificio ? $edificio->nivel : 0;

                // Verificar o que já está na fila para este edifício
                $maxTargetInQueue = BuildingQueue::where('base_id', $base->id)
                    ->where('type', $step->building_type)
                    ->whereNull('cancelled_at')
                    ->max('target_level');
                
                $effectiveLevel = max($currentLevel, $maxTargetInQueue ?? 0);

                if ($effectiveLevel >= $step->target_level) continue;

                // Tenta adicionar à fila (um nível de cada vez até o alvo)
                for ($lvl = $effectiveLevel + 1; $lvl <= $step->target_level; $lvl++) {
                    if (BuildingQueue::where('base_id', $base->id)->whereNull('cancelled_at')->count() >= 5) {
                        break;
                    }

                    try {
                        $this->buildingQueueService->startConstruction($base, $step->building_type);
                    } catch (\Exception $e) {
                        // REGRA: Se falhar (recursos ou outros), SALTA para o próximo edifício do template
                        $results[$base->id][] = "Saltou {$step->building_type} no nível {$lvl}: " . $e->getMessage();
                        continue 2; // Continua para o próximo step (edifício) no loop externo
                    }
                }
            }
        }

        return $results;
    }
}
