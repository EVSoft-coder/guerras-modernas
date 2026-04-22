<?php
 
namespace App\Http\Controllers;
 
use App\Models\Base;
use App\Models\Ataque;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
 
class MapaController extends Controller
{
    /**
     * Exibe o mapa centralizado em coordenadas específicas.
     */
    public function index(Request $request)
    {
        $x = (int) $request->input('x', 500);
        $y = (int) $request->input('y', 500);
        
        $x = max(0, min(1000, $x));
        $y = max(0, min(1000, $y));
 
        $raio = 6;
        
        $bases = Base::with(['jogador.alianca', 'recursos'])
            ->whereBetween('coordenada_x', [$x - $raio, $x + $raio])
            ->whereBetween('coordenada_y', [$y - $raio, $y + $raio])
            ->get();
 
        $jogadorId = Auth::id();
        $selectedBaseId = session('selected_base_id');
        $origemBase = Base::with('tropas')->find($selectedBaseId) ?? Base::where('jogador_id', $jogadorId)->with('tropas')->first();
 
        return Inertia::render('mapa', [
            'bases' => $bases,
            'x' => $x,
            'y' => $y,
            'raio' => $raio,
            'origemBase' => $origemBase,
            'ataquesEnviados' => Ataque::where('origem_base_id', $origemBase?->id)->where('processado', false)->get(),
            'ataquesRecebidos' => Ataque::where('destino_base_id', $origemBase?->id)->where('processado', false)->get(),
            'gameConfig' => config('game')
        ]);
    }
 
    /**
     * API para buscar dados do mapa via Ajax/React.
     */
    public function apiData(Request $request)
    {
        $x = $request->input('x', 500);
        $y = $request->input('y', 500);
        $raio = $request->input('raio', 15);
 
        $bases = Base::with('jogador:id,username')
            ->whereBetween('coordenada_x', [$x - $raio, $x + $raio])
            ->whereBetween('coordenada_y', [$y - $raio, $y + $raio])
            ->get(['id', 'jogador_id', 'nome', 'coordenada_x', 'coordenada_y']);

        return response()->json([
            'center' => ['x' => (int)$x, 'y' => (int)$y],
            'bases' => $bases
        ]);
    }

    /**
     * API para buscar dados de um chunk específico (50x50).
     */
    public function apiChunk(int $cx, int $cy)
    {
        $size = 50;
        $minX = $cx * $size;
        $maxX = $minX + $size - 1;
        $minY = $cy * $size;
        $maxY = $minY + $size - 1;

        $bases = Base::with('jogador:id,username,alianca_id')
            ->whereBetween('coordenada_x', [$minX, $maxX])
            ->whereBetween('coordenada_y', [$minY, $maxY])
            ->get(['id', 'jogador_id', 'nome', 'coordenada_x', 'coordenada_y', 'loyalty']);

        return response()->json([
            'chunk' => ['x' => $cx, 'y' => $cy],
            'bases' => $bases
        ]);
    }
}
