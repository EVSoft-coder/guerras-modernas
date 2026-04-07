<?php

namespace App\Http\Controllers;

use App\Models\Jogador;
use Illuminate\Http\Request;

class RankingController extends Controller
{
    /**
     * Exibe o ranking mundial de jogadores.
     */
    public function index()
    {
        $jogadores = Jogador::with(['bases.edificios', 'alianca'])
            ->get()
            ->map(function ($jogador) {
                $pontos = 0;
                foreach ($jogador->bases as $base) {
                    $pontos += $base->edificios->sum('nivel');
                    // Bónus por ter a base
                    $pontos += 10; 
                }
                $jogador->pontos = $pontos;
                $jogador->total_bases = $jogador->bases->count();
                return $jogador;
            })
            ->sortByDesc('pontos')
            ->values();

        return view('ranking', compact('jogadores'));
    }
}
