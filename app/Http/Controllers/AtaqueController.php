<?php
 
namespace App\Http\Controllers;
 
use App\Models\Base;
use App\Models\Ataque;
use App\Services\CombatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
 
class AtaqueController extends Controller
{
    protected $combatService;
 
    public function __construct(CombatService $combatService)
    {
        $this->combatService = $combatService;
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
            $this->combatService->iniciarAtaque($baseOrigem, $baseDestino, $request->tropas, $request->tipo);
            return redirect()->back()->with('success', "ORDEM DE MARCHA: Tropas enviadas para {$baseDestino->nome}.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
 
    /**
     * Cancela uma operação em andamento (se possível).
     */
    public function cancelar($id)
    {
        $ataque = Ataque::findOrFail($id);
        $baseOrigem = $ataque->origem;
 
        if ($baseOrigem->jogador_id !== Auth::id()) abort(403);
        if ($ataque->processado) return redirect()->back()->withErrors(['error' => 'A missão já atingiu o alvo.']);
 
        try {
            // Devolver tropas à base
            foreach ($ataque->tropas as $unidade => $quantidade) {
                $baseOrigem->tropas()->where('unidade', $unidade)->increment('quantidade', $quantidade);
            }
            $ataque->delete();
            return redirect()->back()->with('success', 'MISSÃO ABORTADA: Tropas regressaram à base.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
