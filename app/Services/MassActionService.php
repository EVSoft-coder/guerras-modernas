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
     * Recrutamento em Massa - Opção A: Base-a-base até acabar recursos.
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
                    // Tenta recrutar o máximo possível para esta unidade nesta base
                    $this->unitQueueService->startRecruitment($base, (int)$unitTypeId, (int)$quantity);
                    $results[$base->id][$unitTypeId] = 'success';
                } catch (\Exception $e) {
                    $results[$base->id][$unitTypeId] = 'error: ' . $e->getMessage();
                }
            }
        }

        return $results;
    }

    /**
     * Aplicar Template - Opção A: Salta se nível já atingido.
     */
    public function applyTemplate(Jogador $jogador, ConstructionTemplate $template, array $baseIds)
    {
        $bases = $jogador->bases()->whereIn('id', $baseIds)->get();
        $results = [];

        foreach ($bases as $base) {
            foreach ($template->steps as $step) {
                // Verificar limite da fila (Máx: 5)
                $currentQueueCount = BuildingQueue::where('base_id', $base->id)->whereNull('cancelled_at')->count();
                if ($currentQueueCount >= 5) {
                    $results[$base->id][] = "Limite de fila atingido (5).";
                    break; // Para este template nesta base
                }

                $edificio = $base->edificios()->where('tipo', $step->building_type)->first();
                $currentLevel = $edificio ? $edificio->nivel : 0;

                // Verificar o que já está na fila para este edifício
                $maxTargetInQueue = BuildingQueue::where('base_id', $base->id)
                    ->where('type', $step->building_type)
                    ->whereNull('cancelled_at')
                    ->max('target_level');
                
                $effectiveLevel = max($currentLevel, $maxTargetInQueue ?? 0);

                // Salta se já atingiu (ou planeou atingir) o nível alvo
                if ($effectiveLevel >= $step->target_level) continue;

                // Tenta adicionar à fila (um nível de cada vez até o alvo ou erro/limite)
                for ($lvl = $effectiveLevel + 1; $lvl <= $step->target_level; $lvl++) {
                    // Re-verificar limite dentro do loop
                    if (BuildingQueue::where('base_id', $base->id)->whereNull('cancelled_at')->count() >= 5) {
                        break;
                    }

                    try {
                        $this->buildingQueueService->startConstruction($base, $step->building_type);
                    } catch (\Exception $e) {
                        $results[$base->id][] = "Parou no nível {$lvl} de {$step->building_type}: " . $e->getMessage();
                        break; // Para este edifício nesta base
                    }
                }
            }
        }

        return $results;
    }
}
