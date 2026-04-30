<?php
 
namespace App\Domain\Economy;
 
use App\Domain\Building\BuildingType;
 
class EconomyRules
{
    /**
     * Calcula a produção por minuto de um recurso específico.
     */
    public static function calculateProductionPerMinute(string $buildingType, int $buildingLevel): float
    {
        return app(\App\Services\EconomyService::class)->getBuildingProduction($buildingType, $buildingLevel) / 60;
    }
 
    /**
     * Define o limite de armazenamento com base no nível do Armazém.
     */
    public static function calculateStorageCapacity(int $armazemLevel): int
    {
        return app(\App\Services\EconomyService::class)->getStorageCapacity($armazemLevel);
    }
    
    /**
     * Calcula a capacidade total de população (slots).
     */
    public static function calculatePopulationCapacity(int $housingLevel): int
    {
        if ($housingLevel <= 0) return 200;
        
        $config = config('game.production.housing');
        $base = $config['base'] ?? 100;
        $factor = $config['factor'] ?? 1.15;

        // Formula exponencial baseada no balanço global
        return (int) ($base * 2 * pow($factor, $housingLevel));
    }
}
