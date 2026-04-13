<?php
 
namespace App\Http\Controllers;
 
use App\Models\Base;
use App\Services\GameService;
use App\Http\Requests\BuildingUpgradeRequest;
use App\Http\Requests\TreinarRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
 
class BaseController extends Controller
{
    protected $gameService;

    public function __construct(GameService $gameService) 
    {
        $this->gameService = $gameService;
    }
 
    /**
     * Iniciar um upgrade de edifício.
     */
    public function upgrade(BuildingUpgradeRequest $request)
    {
        $base = Base::findOrFail($request->base_id);
        if ($base->ownerId !== Auth::id()) abort(403);
 
        try {
            $this->gameService->iniciarUpgrade($base, $request->tipo);
            return redirect()->back()->with('success', "ORDEM DE ENGENHARIA: Upgrade de " . strtoupper($request->tipo) . " iniciado.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
 
    /**
     * Iniciar recrutamento de tropas.
     */
    public function treinar(TreinarRequest $request)
    {
        $base = Base::findOrFail($request->base_id);
        if ($base->ownerId !== Auth::id()) abort(403);
 
        try {
            $this->gameService->iniciarTreino($base, $request->unidade, $request->quantidade);
            return redirect()->back()->with('success', "ORDEM DE RECRUTAMENTO: {$request->quantidade}x " . strtoupper($request->unidade) . " em alistamento.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
 
    /**
     * Trocar base selecionada.
     */
    public function switchBase($id)
    {
        $base = Base::where('id', $id)->where('ownerId', Auth::id())->firstOrFail();
        session(['selected_base_id' => $base->id]);
        return redirect()->route('dashboard')->with('success', "Comando transferido para {$base->nome}!");
    }
 
    /**
     * Efetuar troca de recursos no Mercado Negro.
     */
    public function trocar(Request $request)
    {
        $request->validate([
            'base_id' => 'required|exists:bases,id',
            'oferece' => 'required|string',
            'recebe'  => 'required|string'
        ]);
 
        $base = Base::findOrFail($request->base_id);
        if ($base->ownerId !== Auth::id()) abort(403);
 
        try {
            $custo = 300;
            $ganho = 100;
            
            if ($this->gameService->consumirRecursos($base, [$request->oferece => $custo])) {
                $base->recursos->increment($request->recebe, $ganho);
                return redirect()->back()->with('success', 'TRANSAÇÃO NO MERCADO NEGRO: Recursos trocados com sucesso.');
            }
 
            return redirect()->back()->withErrors(['error' => 'Recursos insuficientes para a troca.']);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
