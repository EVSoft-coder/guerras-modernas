<?php
 
namespace App\Domain\Unit;
 
class UnitRules
{
    /**
     * Obtém os custos de recrutamento de uma unidade.
     */
    public static function calculateCost(string $unitType, int $quantity): array
    {
        $config = config("game.units.{$unitType}");
        if (!$config) return [];
 
        $baseCosts = $config['cost'];
        $costs = [];
 
        foreach ($baseCosts as $resource => $value) {
            $costs[$resource] = $value * $quantity;
        }
 
        return $costs;
    }
 
    /**
     * Calcula o tempo total de treino.
     */
    public static function calculateTime(string $unitType, int $quantity): int
    {
        $timeBase = config("game.units.{$unitType}.time", 30);
        $speedMod = config('game.speed.training', 1);
        
        return ($timeBase * $quantity) / $speedMod;
    }
}
