<?php
 
namespace App\Domain\Economy;
 
use App\Domain\Building\BuildingType;
 
class EconomyRules
{
    /**
     * Calcula a produção por minuto de um recurso específico.
     */
    public static function calculateProductionPerMinute(string $resource, int $buildingLevel): float
    {
        $baseProd = config("game.production.{$resource}", 10);
        $speed = config('game.speed.resources', 1);

        if ($buildingLevel <= 0) return 0;

        // Formula: base * level^1.2 (Implementação Escalável)
        $porHora = ($baseProd * $speed) * pow($buildingLevel, 1.2);
        
        return $porHora / 60;
    }
 
    /**
     * Define o limite de armazenamento com base no nível do QG.
     */
    public static function calculateStorageCapacity(int $qgLevel): int
    {
        return 1000 * pow(2, $qgLevel);
    }
    
    /**
     * Calcula a capacidade total de população (slots).
     * Escala inspirada no Tribal Wars (Level 30 ~ 24000)
     */
    public static function calculatePopulationCapacity(int $complexoLevel): int
    {
        if ($complexoLevel <= 0) return 200; // Mínimo absoluto para survival
        
        // Formula: 200 * 1.18^level
        return (int) (200 * pow(1.18, $complexoLevel));
    }
}
