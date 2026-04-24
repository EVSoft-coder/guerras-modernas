<?php

namespace App\Http\Controllers;

use App\Models\Jogador;
use App\Models\Alianca;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RankingController extends Controller
{
    /**
     * Exibe o ranking mundial de jogadores e alianças.
     */
    public function index(Request $request)
    {
        $tab = $request->input('tab', 'jogadores');

        // Ranking de Jogadores
        $jogadores = Jogador::with(['bases.edificios', 'bases.units.type', 'alianca'])
            ->get()
            ->map(function ($jogador) {
                $pontos = 0;
                $totalUnits = 0;
                $totalAtk = 0;
                $totalDef = 0;

                foreach ($jogador->bases as $base) {
                    // Pontos de edifícios (cada nível = pontos baseados no scaling do edifício)
                    foreach ($base->edificios as $ed) {
                        $buildConfig = config("game.buildings.{$ed->tipo}");
                        $pointsPerLevel = match(true) {
                            in_array($ed->tipo, ['centro_pesquisa', 'parlamento', 'aerodromo', 'radar_estrategico']) => 15,
                            in_array($ed->tipo, ['quartel', 'fabrica_municoes', 'muralha']) => 10,
                            in_array($ed->tipo, ['hq', 'posto_recrutamento']) => 8,
                            default => 5,
                        };
                        $pontos += $ed->nivel * $pointsPerLevel;
                    }

                    // Pontos de unidades
                    foreach ($base->units as $unit) {
                        $unitPoints = ($unit->type->attack ?? 0) + ($unit->type->defense ?? 0);
                        $totalUnits += $unit->quantity;
                        $totalAtk += ($unit->type->attack ?? 0) * $unit->quantity;
                        $totalDef += ($unit->type->defense ?? 0) * $unit->quantity;
                        $pontos += (int)($unit->quantity * max(1, $unitPoints / 10));
                    }

                    // Bónus por ter a base
                    $pontos += 50;
                }

                $jogador->pontos = $pontos;
                $jogador->total_bases = $jogador->bases->count();
                $jogador->total_units = $totalUnits;
                $jogador->attack_power = $totalAtk;
                $jogador->defense_power = $totalDef;
                return $jogador;
            })
            ->sortByDesc('pontos')
            ->values();

        // Ranking de Alianças
        $aliancas = Alianca::with('membros.bases.edificios')
            ->get()
            ->map(function ($alianca) {
                $totalPontos = 0;
                $totalBases = 0;
                $totalMembros = $alianca->membros->count();

                foreach ($alianca->membros as $membro) {
                    foreach ($membro->bases as $base) {
                        foreach ($base->edificios as $ed) {
                            $pointsPerLevel = match(true) {
                                in_array($ed->tipo, ['centro_pesquisa', 'parlamento', 'aerodromo', 'radar_estrategico']) => 15,
                                in_array($ed->tipo, ['quartel', 'fabrica_municoes', 'muralha']) => 10,
                                in_array($ed->tipo, ['hq', 'posto_recrutamento']) => 8,
                                default => 5,
                            };
                            $totalPontos += $ed->nivel * $pointsPerLevel;
                        }
                        $totalBases++;
                        $totalPontos += 50;
                    }
                }

                $alianca->total_pontos = $totalPontos;
                $alianca->total_bases = $totalBases;
                $alianca->total_membros = $totalMembros;
                return $alianca;
            })
            ->sortByDesc('total_pontos')
            ->values();

        return Inertia::render('ranking', [
            'jogadores' => $jogadores,
            'aliancas' => $aliancas,
            'tab' => $tab,
        ]);
    }
}
