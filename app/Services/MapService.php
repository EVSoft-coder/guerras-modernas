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
     * Gera uma posição livre aleatória no mapa (0 - 1000).
     * PASSO 3 - range 0-1000 + collision check
     */
    public function generateBasePosition(int $range = 1000): array
    {
        $maxAttempts = 100;
        $attempt = 0;

        while ($attempt < $maxAttempts) {
            $x = rand(0, $range);
            $y = rand(0, $range);

            $exists = Base::where('x', $x)->where('y', $y)->exists();
            if (!$exists) {
                return ['x' => $x, 'y' => $y];
            }
            $attempt++;
        }

        throw new \Exception("CONGESTIONAMENTO GEOESPACIAL: Não foi possível localizar coordenadas livres no setor.");
    }

    /**
     * Calcula a distância euclidiana entre duas bases.
     * PASSO 5 - sqrt((x2-x1)^2 + (y2-y1)^2)
     */
    public function calculateDistance(Base $baseA, Base $baseB): float
    {
        return sqrt(
            pow($baseB->x - $baseA->x, 2) + 
            pow($baseB->y - $baseA->y, 2)
        );
    }
}
