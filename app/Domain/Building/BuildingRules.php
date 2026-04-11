<?php
 
namespace App\Domain\Building;
 
class BuildingRules
{
    /**
     * Calcula o custo de um upgrade com base no nível atual.
     */
    public static function calculateCost(string $type, int $currentLevel): array
    {
        $type = BuildingType::normalize($type);
        $config = config("game.buildings.{$type}");
        
        if (!$config) {
            return [];
        }
 
        $scaling = config('game.scaling', 1.5);
        $baseCosts = $config['cost'];
        $costs = [];
 
        foreach ($baseCosts as $resource => $baseValue) {
            // Formula: Base * (1 + Level * Scaling)
            $costs[$resource] = (int) ($baseValue * (1 + ($currentLevel * $scaling)));
        }
 
        return $costs;
    }
 
    /**
     * Calcula o tempo de construção para o próximo nível.
     */
    public static function calculateTime(string $type, int $currentLevel): int
    {
        $type = BuildingType::normalize($type);
        $config = config("game.buildings.{$type}");
        
        if (!$config) return 0;
 
        $timeBase = $config['time_base'] ?? 60;
        $speedMod = config('game.speed.construction', 1);
        
        // Formula: (TimeBase * (1 + Level * 0.5)) / Speed
        $timeSeconds = ($timeBase * (1 + ($currentLevel * 0.5))) / $speedMod;
 
        return (int) max(5, $timeSeconds);
    }
 
    /**
     * Define os requisitos de nível de outros edifícios.
     */
    public static function getRequirements(string $type): array
    {
        $type = BuildingType::normalize($type);
        return config("game.buildings.{$type}.requires", []);
    }
}
