<?php
 
namespace App\Http\Controllers;
 
use App\Models\Base;
use App\Models\Ataque;
use App\Services\GameService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
 
class AtaqueController extends Controller
{
    protected $gameService;
 
    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }
 
    /**
     * Envia uma missão militar.
     */
    public function enviar(Request $request)
    {
        $request->validate([
            'origem_id' => 'required|exists:bases,id',
            'destino_id' => 'required|exists:bases,id',
            'tropas' => 'required|array',
            'tipo' => 'required|string|in:ataque,espionagem,conquista'
        ]);
 
        $baseOrigem = Base::findOrFail($request->origem_id);
        if ($baseOrigem->jogador_id !== Auth::id()) abort(403);
 
        $baseDestino = Base::findOrFail($request->destino_id);
 
        try {
            $ataque = $this->gameService->iniciarAtaque($baseOrigem, $baseDestino, $request->tropas, $request->tipo);
            
            return redirect()->back()->with('success', "ORDEM DE MARCHA: Tropas enviadas para {$baseDestino->nome}. Chegada em {$ataque->chegada_em->format('H:i:s')}.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
