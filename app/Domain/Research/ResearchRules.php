<?php
 
namespace App\Domain\Research;
 
class ResearchRules
{
    /**
     * Calcula o custo de uma pesquisa.
     */
    public static function calculateCost(string $tech, int $currentLevel): array
    {
        $config = config("game.research.{$tech}");
        if (!$config) return [];
 
        $baseCosts = $config['cost'];
        $costs = [];
 
        foreach ($baseCosts as $resource => $value) {
            $costs[$resource] = (int) ($value * (1 + ($currentLevel * 1.2)));
        }
 
        return $costs;
    }
 
    /**
     * Calcula o tempo para o próximo nível.
     */
    public static function calculateTime(string $tech, int $currentLevel): int
    {
        $timeBase = config("game.research.{$tech}.time_base", 600);
        $speedMod = config('game.speed.construction', 1); // Pesquisa usa speed de construção ou global
        
        return (int) (($timeBase * (1 + ($currentLevel * 0.5))) / $speedMod);
    }
}
