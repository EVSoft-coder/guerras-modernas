<?php
 
namespace App\Http\Controllers;
 
use App\Models\Base;
use App\Models\Movement;
use App\Models\AliancaDiplomacia;
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
 
        $raio = 15;
        
        $bases = Base::with(['jogador.alianca', 'recursos', 'edificios:id,base_id,nivel'])
            ->whereBetween('coordenada_x', [$x - $raio, $x + $raio])
            ->whereBetween('coordenada_y', [$y - $raio, $y + $raio])
            ->get()
            ->map(function ($base) {
                $base->is_npc = is_null($base->jogador_id);
                $base->pontos = $base->edificios->sum('nivel') + ($base->is_npc ? 0 : 10);
                unset($base->edificios);
                return $base;
            });
 
        $jogadorId = Auth::id();
        $selectedBaseId = session('selected_base_id');
        $origemBase = Base::with('units.type')->find($selectedBaseId) 
            ?? Base::where('jogador_id', $jogadorId)->with('units.type')->first();
 
        $jogador = Auth::user()->jogador;
        $diplomacia = [];
        if ($jogador->alianca_id) {
            $diplomacia = AliancaDiplomacia::where('alianca_id', $jogador->alianca_id)->get();
        }

        return Inertia::render('mapa', [
            'bases' => $bases,
            'x' => $x,
            'y' => $y,
            'raio' => $raio,
            'origemBase' => $origemBase,
            'ataquesEnviados' => Movement::where('origin_id', $origemBase?->id)->where('status', 'moving')->get(),
            'ataquesRecebidos' => Movement::where('target_id', $origemBase?->id)->where('status', 'moving')->get(),
            'gameConfig' => config('game'),
            'diplomacia' => $diplomacia,
            'userAliancaId' => $jogador->alianca_id,
            'general' => $jogador->general()->with('skills')->first()
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
 
        $bases = Base::with(['jogador:id,username,alianca_id', 'edificios:id,base_id,nivel'])
            ->whereBetween('coordenada_x', [$x - $raio, $x + $raio])
            ->whereBetween('coordenada_y', [$y - $raio, $y + $raio])
            ->get(['id', 'jogador_id', 'nome', 'coordenada_x', 'coordenada_y', 'loyalty'])
            ->map(function ($base) {
                $base->is_npc = is_null($base->jogador_id);
                $base->pontos = $base->edificios->sum('nivel') + ($base->is_npc ? 0 : 10);
                unset($base->edificios);
                return $base;
            });

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

        $bases = Base::with(['jogador:id,username,alianca_id', 'edificios:id,base_id,nivel'])
            ->whereBetween('coordenada_x', [$minX, $maxX])
            ->whereBetween('coordenada_y', [$minY, $maxY])
            ->get(['id', 'jogador_id', 'nome', 'coordenada_x', 'coordenada_y', 'loyalty'])
            ->map(function ($base) {
                $base->is_npc = is_null($base->jogador_id);
                $base->pontos = $base->edificios->sum('nivel') + ($base->is_npc ? 0 : 10);
                unset($base->edificios); // Não enviar edifícios no chunk
                return $base;
            });

        return response()->json([
            'chunk' => ['x' => $cx, 'y' => $cy],
            'bases' => $bases
        ]);
    }
}
