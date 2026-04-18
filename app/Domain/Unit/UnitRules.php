<?php
 
namespace App\Domain\Unit;
 
class UnitRules
{
    /**
     * Obtém os custos de recrutamento de uma unidade.
     */
    public static function calculateCost(string $unitType, int $quantity, int $buildingLevel = 1): array
    {
        return app(\App\Services\EconomyService::class)->getUnitCost($unitType, $buildingLevel, $quantity);
    }
 
    /**
     * Calcula o tempo total de treino.
     */
    public static function calculateTime(string $unitType, int $quantity, int $buildingLevel = 1): int
    {
        return app(\App\Services\EconomyService::class)->getUnitTime($unitType, $buildingLevel, $quantity);
    }
}
