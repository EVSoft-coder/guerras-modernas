<?php

namespace App\Http\Controllers;

use App\Models\Base;
use Illuminate\Http\Request;

class MapaController extends Controller
{
    /**
     * Exibe o mapa centralizado em coordenadas específicas.
     */
    public function index(Request $request)
    {
        $x = (int) $request->get('x', 500);
        $y = (int) $request->get('y', 500);
        
        // Impedir coordenadas fora do mundo (0-1000)
        $x = max(0, min(1000, $x));
        $y = max(0, min(1000, $y));

        $raio = 6; // Ver total de 13x13 (raio 6 central)
        
        $bases = Base::with(['jogador.alianca', 'recursos'])
            ->whereBetween('coordenada_x', [$x - $raio, $x + $raio])
            ->whereBetween('coordenada_y', [$y - $raio, $y + $raio])
            ->get();

        $selectedBaseId = session('selected_base_id');
        $origemBase = Base::with('tropas')->find($selectedBaseId) ?? Base::where('jogador_id', \Illuminate\Support\Facades\Auth::id())->with('tropas')->first();

        return \Inertia\Inertia::render('mapa', [
            'bases' => $bases,
            'x' => $x,
            'y' => $y,
            'raio' => $raio,
            'origemBase' => $origemBase,
            'gameConfig' => config('game')
        ]);
    }

    /**
     * API para buscar dados do mapa via Ajax/React.
     */
    public function apiData(Request $request)
    {
        $x = $request->get('x', 500);
        $y = $request->get('y', 500);
        $raio = $request->get('raio', 15);

        $bases = Base::with('jogador:id,username')
            ->whereBetween('coordenada_x', [$x - $raio, $x + $raio])
            ->whereBetween('coordenada_y', [$y - $raio, $y + $raio])
            ->get(['id', 'jogador_id', 'nome', 'coordenada_x', 'coordenada_y', 'qg_nivel']);

        return response()->json([
            'center' => ['x' => (int)$x, 'y' => (int)$y],
            'bases' => $bases
        ]);
    }
}
