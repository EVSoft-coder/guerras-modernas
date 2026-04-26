<?php

namespace App\Services;

use App\Models\Jogador;
use App\Models\Alianca;
use App\Models\PlayerStat;
use App\Models\AllianceStat;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Tira um snapshot de todos os jogadores e alianças para o dia de hoje.
     */
    public function takeSnapshots()
    {
        $today = Carbon::today();

        DB::transaction(function () use ($today) {
            // 1. Snapshot de Jogadores
            $jogadores = Jogador::with(['bases.edificios', 'bases.units.type'])->get();
            foreach ($jogadores as $jogador) {
                $stats = $this->calculatePlayerStats($jogador);
                
                PlayerStat::updateOrCreate(
                    ['jogador_id' => $jogador->id, 'recorded_at' => $today],
                    [
                        'pontos' => $stats['pontos'],
                        'total_units' => $stats['total_units'],
                        'attack_power' => $stats['attack_power'],
                        'defense_power' => $stats['defense_power'],
                        'total_bases' => $stats['total_bases'],
                    ]
                );
            }

            // 2. Snapshot de Alianças
            $aliancas = Alianca::with('membros.bases.edificios')->get();
            foreach ($aliancas as $alianca) {
                $stats = $this->calculateAllianceStats($alianca);
                
                AllianceStat::updateOrCreate(
                    ['alianca_id' => $alianca->id, 'recorded_at' => $today],
                    [
                        'total_pontos' => $stats['total_pontos'],
                        'total_membros' => $stats['total_membros'],
                        'total_bases' => $stats['total_bases'],
                    ]
                );
            }
        });
    }

    private function calculatePlayerStats($jogador)
    {
        $pontos = 0;
        $totalUnits = 0;
        $totalAtk = 0;
        $totalDef = 0;

        foreach ($jogador->bases as $base) {
            foreach ($base->edificios as $ed) {
                $pointsPerLevel = match(true) {
                    in_array($ed->tipo, ['centro_pesquisa', 'parlamento', 'aerodromo', 'radar_estrategico']) => 15,
                    in_array($ed->tipo, ['quartel', 'fabrica_municoes', 'muralha']) => 10,
                    in_array($ed->tipo, ['hq', 'posto_recrutamento']) => 8,
                    default => 5,
                };
                $pontos += $ed->nivel * $pointsPerLevel;
            }

            foreach ($base->units as $unit) {
                $unitPoints = ($unit->type->attack ?? 0) + ($unit->type->defense ?? 0);
                $totalUnits += $unit->quantity;
                $totalAtk += ($unit->type->attack ?? 0) * $unit->quantity;
                $totalDef += ($unit->type->defense ?? 0) * $unit->quantity;
                $pontos += (int)($unit->quantity * max(1, $unitPoints / 10));
            }
            $pontos += 50;
        }

        return [
            'pontos' => $pontos,
            'total_units' => $totalUnits,
            'attack_power' => $totalAtk,
            'defense_power' => $totalDef,
            'total_bases' => $jogador->bases->count(),
        ];
    }

    private function calculateAllianceStats($alianca)
    {
        $totalPontos = 0;
        $totalBases = 0;

        foreach ($alianca->membros as $membro) {
            $stats = $this->calculatePlayerStats($membro);
            $totalPontos += $stats['pontos'];
            $totalBases += $stats['total_bases'];
        }

        return [
            'total_pontos' => $totalPontos,
            'total_membros' => $alianca->membros->count(),
            'total_bases' => $totalBases,
        ];
    }
}
