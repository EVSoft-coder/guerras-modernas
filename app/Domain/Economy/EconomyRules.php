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
        $scaling = config('game.scaling', 1.5);
 
        // Formula: (BasePerHour * Speed) * (1 + Level * Scaling)
        $porHora = ($baseProd * $speed) * (1 + ($buildingLevel * $scaling));
        
        return $porHora / 60;
    }
 
    /**
     * Define o limite de armazenamento com base no nível do QG.
     */
    public static function calculateStorageCapacity(int $qgLevel): int
    {
        return 1000 * pow(2, $qgLevel);
    }
}
