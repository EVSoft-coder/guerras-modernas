<?php
 
namespace App\Domain\Building;
 
class BuildingRules
{
    /**
     * Calcula o custo de um upgrade com base no nível atual.
     */
    public static function calculateCost(string $type, int $currentLevel): array
    {
        return app(\App\Services\EconomyService::class)->getBuildingUpgradeCost($type, $currentLevel);
    }
 
    /**
     * Calcula o tempo de construção para o próximo nível.
     */
    public static function calculateTime(string $type, int $currentLevel, ?Base $base = null): int
    {
        if (!$base) {
            // Fallback se a base não for passada (tentar obter da sessão se necessário, mas idealmente passamos)
            $base = \App\Models\Base::find(session('selected_base_id')) ?? new \App\Models\Base();
        }
        return app(\App\Services\EconomyService::class)->getBuildingUpgradeTime($base, $type, $currentLevel);
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
