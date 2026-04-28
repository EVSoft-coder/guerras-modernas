<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Edificio;

class PointsService
{
    /**
     * Tabela de pontos estilo TribalWars.
     * Cada nível de edifício tem um valor acumulado.
     */
    protected $pointsTable = [
        'centro_comando' => [1, 10, 25, 45, 70, 100, 140, 190, 250, 320, 400, 490, 590, 700, 820, 950, 1100, 1260, 1430, 1620, 1830, 2060, 2310, 2580, 2870, 3180, 3510, 3860, 4230, 4620],
        'mina_ferro' => [1, 5, 12, 22, 35, 50, 68, 90, 115, 145, 180, 220, 265, 315, 370, 430, 495, 565, 640, 720, 805, 895, 990, 1090, 1195, 1305, 1420, 1540, 1665, 1800],
        'mina_ouro' => [1, 5, 12, 22, 35, 50, 68, 90, 115, 145, 180, 220, 265, 315, 370, 430, 495, 565, 640, 720, 805, 895, 990, 1090, 1195, 1305, 1420, 1540, 1665, 1800],
        'mina_petroleo' => [1, 5, 12, 22, 35, 50, 68, 90, 115, 145, 180, 220, 265, 315, 370, 430, 495, 565, 640, 720, 805, 895, 990, 1090, 1195, 1305, 1420, 1540, 1665, 1800],
        'armazem' => [1, 5, 12, 22, 35, 50, 68, 90, 115, 145, 180, 220, 265, 315, 370, 430, 495, 565, 640, 720, 805, 895, 990, 1090, 1195, 1305, 1420, 1540, 1665, 1800],
        'fazenda' => [1, 5, 12, 22, 35, 50, 68, 90, 115, 145, 180, 220, 265, 315, 370, 430, 495, 565, 640, 720, 805, 895, 990, 1090, 1195, 1305, 1420, 1540, 1665, 1800],
        'quartel' => [1, 15, 35, 65, 105, 155, 215, 285, 365, 455, 555, 665, 785, 915, 1055, 1205, 1365, 1535, 1715, 1905, 2105, 2315, 2535, 2765, 3005],
        'muralha' => [1, 10, 25, 45, 70, 100, 140, 190, 250, 320, 400, 490, 590, 700, 820, 950, 1100, 1260, 1430, 1620],
        'pesquisa' => [1, 20, 45, 80, 125, 180, 245, 320, 405, 500, 605, 720, 845, 980, 1125, 1280, 1445, 1620, 1805, 2000],
    ];

    /**
     * Recalcula os pontos de uma base e do seu jogador.
     */
    public function recalculateBasePoints(Base $base): int
    {
        $totalPoints = 0;
        $edificios = $base->edificios;

        foreach ($edificios as $edificio) {
            $totalPoints += $this->getPointsForLevel($edificio->tipo, $edificio->nivel);
        }

        $base->pontos = $totalPoints;
        $base->save();

        $this->recalculatePlayerPoints($base->jogador_id);

        return $totalPoints;
    }

    /**
     * Recalcula os pontos totais de um jogador.
     */
    public function recalculatePlayerPoints($jogadorId): int
    {
        $total = Base::where('jogador_id', $jogadorId)->sum('pontos');
        
        $jogador = \App\Models\Jogador::find($jogadorId);
        if ($jogador) {
            $jogador->pontos = $total;
            $jogador->save();
        }

        return $total;
    }

    /**
     * Retorna os pontos para um nível específico de um edifício.
     */
    private function getPointsForLevel(string $type, int $level): int
    {
        if ($level <= 0) return 0;
        
        $table = $this->pointsTable[$type] ?? null;
        if (!$table) return 0;

        // O nível é 1-based, o array é 0-based
        return $table[$level - 1] ?? end($table);
    }
}
