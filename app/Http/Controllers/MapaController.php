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
        $x = $request->get('x', 500);
        $y = $request->get('y', 500);
        $raio = 15; // Ver 30x30 tiles (raio 15)

        $bases = Base::with('jogador')
            ->whereBetween('coordenada_x', [$x - $raio, $x + $raio])
            ->whereBetween('coordenada_y', [$y - $raio, $y + $raio])
            ->get();

        return view('mapa', compact('bases', 'x', 'y', 'raio'));
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
