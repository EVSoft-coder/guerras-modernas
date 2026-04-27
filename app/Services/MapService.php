<?php

namespace App\Services;

use App\Models\Base;

/**
 * MapService - Sistema de Inteligência Geoespacial.
 * Gere coordenadas de bases e cálculos de distância.
 */
class MapService
{
    /**
     * Gera uma posição aleatória (sem check de BD - Atomic Step).
     * PASSO 2 - REMOVER CHECKS PRÉVIOS
     */
    public function generateBasePosition(): array
    {
        $range = config('game.map.width', 1000);
        return [
            'x' => rand(0, $range),
            'y' => rand(0, $range)
        ];
    }

    /**
     * Calcula o tempo de viagem entre bases.
     * PASSO 4 - calculateTravelTime
     */
    public function calculateTravelTime(Base $baseA, Base $baseB, ?float $speed = null): int
    {
        $distance = $this->calculateDistance($baseA, $baseB);
        $speed = $speed ?? config('game.movement.base_speed', 1.0);
        
        $seconds = (int) ceil($distance / $speed);
        $minTime = config('game.movement.min_travel_time', 60);

        return max($minTime, $seconds);
    }

    /**
     * Calcula a distância euclidiana entre duas bases.
     * PASSO 5 - sqrt((x2-x1)^2 + (y2-y1)^2)
     */
    public function calculateDistance(Base $baseA, Base $baseB): float
    {
        return sqrt(
            pow($baseB->coordenada_x - $baseA->coordenada_x, 2) + 
            pow($baseB->coordenada_y - $baseA->coordenada_y, 2)
        );
    }
}
