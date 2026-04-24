<?php

namespace App\Domain\Research;

class ResearchRules
{
    /**
     * Calcula o custo de uma pesquisa.
     * Fórmula: base_cost * (1 + currentLevel * 1.2)
     */
    public static function calculateCost(string $tech, int $currentLevel): array
    {
        $config = config("research.{$tech}");
        if (!$config || empty($config['cost'])) return [];

        $baseCosts = $config['cost'];
        $costs = [];

        foreach ($baseCosts as $resource => $value) {
            $costs[$resource] = (int) ($value * (1 + ($currentLevel * 1.2)));
        }

        return $costs;
    }

    /**
     * Calcula o tempo para o próximo nível.
     * Fórmula: time_base * (1 + currentLevel * 0.5)
     */
    public static function calculateTime(string $tech, int $currentLevel): int
    {
        $timeBase = config("research.{$tech}.time_base", 600);
        
        return (int) ($timeBase * (1 + ($currentLevel * 0.5)));
    }
}
