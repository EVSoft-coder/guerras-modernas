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
        $config = config("game.buildings.{$type}");
        if (!$config) return [];

        $baseCosts = $config['cost'] ?? [];
        $factor = $config['scaling'] ?? 1.25;
        
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

        $factor = config('game.time_multiplier', 1.05);
        $baseTime = $config['time_base'] ?? 60;

        // Fórmula exponencial FASE TEMPO
        $rawTime = $baseTime * pow($factor, $level);

        // Aplica redução por nível de QG (Modificador TribalWars)
        $hqLevel = app(GameService::class)->obterNivelEdificio($base, \App\Domain\Building\BuildingType::HQ) ?: 1;
        $reductionPerLevel = config('game.hq_reduction_per_level', 0.08);
        
        // Fator de redução: ex: level 10 -> 1 - (9 * 0.08) = 0.28 (72% de redução)
        $reductionFactor = max(0.1, 1 - (($hqLevel - 1) * $reductionPerLevel));

        return (int) max(5, $rawTime * $reductionFactor);
    }

    /**
     * Calcula a produção horária de um edifício.
     * FASE PRODUÇÃO: production = base * (factor ^ nível)
     */
    public function getBuildingProduction(string $type, int $level): float
    {
        $config = config("game.production.{$type}");
        
        if ($config) {
            $base = $config['base'];
            $factor = $config['factor'] ?? 1.2;
            return $base * pow($factor, $level);
        }

        return 0;
    }

    /**
     * Calcula a capacidade de armazenamento total.
     * FASE CAP: storage = base * (factor ^ nível)
     */
    public function getStorageCapacity(int $armazemLevel): int
    {
        $base = config('game.storage_base', 1200);
        $factor = config('game.storage_factor', 1.25);

        // Nível mínimo de 1 para evitar bases com 0 de capacidade
        $level = max(1, $armazemLevel);

        return (int) ($base * pow($factor, $level));
    }

    /**
     * Calcula o custo de uma unidade baseado no nível do edifício produtor.
     * PASSO 6: Escalar com building level
     */
    public function getUnitCost(string $unitName, int $buildingLevel, int $quantity = 1, ?string $slug = null): array
    {
        $key = $slug ?: $unitName;
        $config = config("game.units.{$key}");
        
        $baseCosts = [];
        
        if ($config && isset($config['cost'])) {
            $baseCosts = $config['cost'];
        } else {
            // Tenta obter da Base de Dados se o config falhar
            $unitType = \App\Models\UnitType::where('slug', $key)->orWhere('name', $unitName)->first();
            if ($unitType) {
                $baseCosts = [
                    'suprimentos' => $unitType->cost_suprimentos,
                    'combustivel' => $unitType->cost_combustivel,
                    'municoes' => $unitType->cost_municoes,
                    'metal' => $unitType->cost_metal ?? 0,
                ];
            }
        }

        if (empty($baseCosts)) return [];

        $increaseFactor = config('game.units_cost_increase_per_level', 0.03);
        
        // Multiplicador: 1 + (level-1) * 0.03
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
        
        $baseTime = 30;
        if ($config && isset($config['time'])) {
            $baseTime = $config['time'];
        } else {
            $unitType = \App\Models\UnitType::where('slug', $key)->orWhere('name', $unitName)->first();
            if ($unitType) {
                $baseTime = $unitType->build_time;
            }
        }

        $reductionFactor = config('game.units_time_reduction_per_level', 0.08);

        // Cada nível reduz o tempo base de forma composta
        $speedMultiplier = pow(1 - $reductionFactor, $buildingLevel - 1);
        $speedMultiplier = max(0.1, $speedMultiplier); // Mínimo de 10% do tempo original

        return (int) max(1, ($baseTime * $quantity) * $speedMultiplier);
    }
}
