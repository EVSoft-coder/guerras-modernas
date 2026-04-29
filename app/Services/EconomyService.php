<?php

namespace App\Services;

use App\Models\Base;
use App\Domain\Building\BuildingRules;

class EconomyService
{
    /**
     * Calcula o custo de upgrade exponencial para um edifício.
     * FASE ECONOMIA: custo = base * (factor ^ nível)
     */
    public function getBuildingUpgradeCost(string $type, int $level): array
    {
        $specialConfig = config("economy.buildings.upgrade_costs.{$type}");
        
        if ($specialConfig) {
            $baseCosts = $specialConfig['base'];
            $factor = $specialConfig['factor'];
            
            $costs = [];
            foreach ($baseCosts as $res => $baseValue) {
                $costs[$res] = (int) ($baseValue * pow($factor, $level));
            }
            return $costs;
        }

        // Fallback legado
        $config = config("game.buildings.{$type}");
        if (!$config) return [];

        $factor = config('economy.buildings.cost_multiplier', 1.6);
        $baseCosts = $config['cost'] ?? [];
        $costs = [];

        foreach ($baseCosts as $res => $baseValue) {
            $costs[$res] = (int) ($baseValue * pow($factor, $level));
        }

        return $costs;
    }

    /**
     * Calcula o tempo de upgrade exponencial para um edifício.
     * FASE TEMPO: tempo = base_time * (factor ^ nível)
     */
    public function getBuildingUpgradeTime(Base $base, string $type, int $level): int
    {
        $config = config("game.buildings.{$type}");
        if (!$config) return 60;

        $factor = config('economy.buildings.time_multiplier', 1.1);
        $baseTime = $config['time_base'] ?? 60;

        // Fórmua exponencial FASE TEMPO
        $rawTime = $baseTime * pow($factor, $level);

        // Aplica redução por nível de QG (Modificador TribalWars)
        $hqLevel = app(GameService::class)->obterNivelEdificio($base, \App\Domain\Building\BuildingType::HQ) ?: 1;
        $reductionPerLevel = config('economy.buildings.hq_reduction_per_level', 0.10);
        
        // Fator de redução: ex: level 10 -> 1 - (9 * 0.10) = 0.1 (90% de redução)
        $reductionFactor = max(0.1, 1 - (($hqLevel - 1) * $reductionPerLevel));

        return (int) max(5, $rawTime * $reductionFactor);
    }

    /**
     * Calcula a produção horária de um edifício.
     * FASE PRODUÇÃO: production = base * (factor ^ nível)
     */
    public function getBuildingProduction(string $type, int $level): float
    {
        $config = config("economy.production.resource_buildings.{$type}");
        
        if ($config) {
            $base = $config['base'];
            $factor = $config['factor'];
            return $base * pow($factor, $level);
        }

        // Fallback legado ou para edifícios genéricos
        $baseProduction = config("game.buildings.{$type}.production_base", 10);
        $exponent = config('economy.production.exponent', 1.2);
        return $baseProduction * pow($level, $exponent);
    }

    /**
     * Calcula a capacidade de armazenamento total.
     * FASE CAP: storage = base * (factor ^ nível)
     */
    public function getStorageCapacity(int $hqLevel): int
    {
        $base = config('economy.storage.base', 800);
        $factor = config('economy.storage.factor', 1.25);

        return (int) ($base * pow($factor, $hqLevel));
    }

    /**
     * Calcula o custo de uma unidade baseado no nível do edifício produtor.
     * PASSO 6: Escalar com building level
     */
    public function getUnitCost(string $unitName, int $buildingLevel, int $quantity = 1, ?string $slug = null): array
    {
        $key = $slug ?: $unitName;
        $config = config("game.units.{$key}");
        if (!$config && $slug) $config = config("game.units.{$unitName}"); // Fallback
        if (!$config) return [];

        $baseCosts = $config['cost'] ?? [];
        $increaseFactor = config('economy.units.cost_increase_per_level', 0.05);
        
        // Multiplicador: 1 + (level-1) * 0.05
        $levelMultiplier = 1 + (($buildingLevel - 1) * $increaseFactor);
        
        $costs = [];
        foreach ($baseCosts as $res => $value) {
            $costs[$res] = (int) ($value * $levelMultiplier * $quantity);
        }

        return $costs;
    }

    /**
     * Calcula o tempo de treino de uma unidade.
     * PASSO 7: Reduzir com building level
     */
    public function getUnitTime(string $unitName, int $buildingLevel, int $quantity = 1, ?string $slug = null): int
    {
        $key = $slug ?: $unitName;
        $config = config("game.units.{$key}");
        if (!$config && $slug) $config = config("game.units.{$unitName}");
        if (!$config) return 0;

        $baseTime = $config['time'] ?? 30;
        $reductionFactor = config('economy.units.time_reduction_per_level', 0.03);

        // Cada nível reduz 3% do tempo base de forma composta
        // formula: base * (1 - reduction)^ (level - 1)
        $speedMultiplier = pow(1 - $reductionFactor, $buildingLevel - 1);
        $speedMultiplier = max(0.1, $speedMultiplier); // Mínimo de 10% do tempo original

        return (int) max(1, ($baseTime * $quantity) * $speedMultiplier);
    }
}
