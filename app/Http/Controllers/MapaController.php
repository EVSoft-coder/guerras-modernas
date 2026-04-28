<?php
 
namespace App\Http\Controllers;
 
use App\Models\Base;
use App\Models\Movement;
use App\Models\AliancaDiplomacia;
use App\Models\UnitType;
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
        $targetId = $request->input('target_id');
        $targetCoord = $request->input('target_coord');

        if ($targetId) {
            $targetBase = Base::find($targetId);
            if ($targetBase) {
                $x = $targetBase->coordenada_x;
                $y = $targetBase->coordenada_y;
            }
        } elseif ($targetCoord && str_contains($targetCoord, ':')) {
            [$tx, $ty] = explode(':', $targetCoord);
            $x = (int)$tx;
            $y = (int)$ty;
        }
        
        $x = max(0, min(1000, $x));
        $y = max(0, min(1000, $y));
 
        $raio = 15;
        
        $bases = Base::with(['jogador.alianca', 'recursos'])
            ->whereBetween('coordenada_x', [$x - $raio, $x + $raio])
            ->whereBetween('coordenada_y', [$y - $raio, $y + $raio])
            ->get()
            ->map(function ($base) {
                $base->is_npc = is_null($base->jogador_id);
                // Pontos já vêm da base de dados ($base->pontos)
                return $base;
            });
 
        $jogadorId = Auth::id();
        $selectedBaseId = session('selected_base_id');
        $origemBase = Base::with('units.type')->find($selectedBaseId) 
            ?? Base::where('jogador_id', $jogadorId)->with('units.type')->first();
 
        $jogador = Auth::user();
        $diplomacia = [];
        $general = null;
        $userAliancaId = null;

        if ($jogador) {
            $userAliancaId = $jogador->alianca_id;
            if ($userAliancaId) {
                $diplomacia = AliancaDiplomacia::where('alianca_id', $userAliancaId)->get();
            }
            $general = $jogador->general()->with('skills')->first();
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
            'userAliancaId' => $userAliancaId,
            'general' => $general,
            'targetId' => $request->input('target_id'),
            'unitTypes' => UnitType::all()
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
 
        $bases = Base::with(['jogador:id,username,alianca_id'])
            ->whereBetween('coordenada_x', [$x - $raio, $x + $raio])
            ->whereBetween('coordenada_y', [$y - $raio, $y + $raio])
            ->get(['id', 'jogador_id', 'nome', 'coordenada_x', 'coordenada_y', 'loyalty', 'pontos'])
            ->map(function ($base) {
                $base->is_npc = is_null($base->jogador_id);
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

        $bases = Base::with(['jogador:id,username,alianca_id'])
            ->whereBetween('coordenada_x', [$minX, $maxX])
            ->whereBetween('coordenada_y', [$minY, $maxY])
            ->get(['id', 'jogador_id', 'nome', 'coordenada_x', 'coordenada_y', 'loyalty', 'pontos'])
            ->map(function ($base) {
                $base->is_npc = is_null($base->jogador_id);
                return $base;
            });

        return response()->json([
            'chunk' => ['x' => $cx, 'y' => $cy],
            'bases' => $bases
        ]);
    }
}
