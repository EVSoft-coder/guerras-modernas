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
        if ($base->jogador_id !== Auth::id()) abort(403);
 
        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($base, $request) {
                $this->gameService->iniciarUpgrade($base, $request->tipo);
            });
            if ($request->wantsJson()) {
                return response()->json(['status' => 'success', 'message' => "Upgrade de " . strtoupper($request->tipo) . " iniciado."]);
            }
            return redirect()->back()->with('success', "ORDEM DE ENGENHARIA: Upgrade de " . strtoupper($request->tipo) . " iniciado.");
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['status' => 'error', 'message' => $e->getMessage()], 422);
            }
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
 
    /**
     * Iniciar recrutamento de tropas.
     */
    public function treinar(TreinarRequest $request)
    {
        $base = Base::findOrFail($request->base_id);
        if ($base->jogador_id !== Auth::id()) abort(403);
 
        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($base, $request) {
                $this->gameService->iniciarTreino($base, $request->unidade, $request->quantidade);
            });
            if ($request->wantsJson()) {
                return response()->json(['status' => 'success', 'message' => "{$request->quantidade}x " . strtoupper($request->unidade) . " em alistamento."]);
            }
            return redirect()->back()->with('success', "ORDEM DE RECRUTAMENTO: {$request->quantidade}x " . strtoupper($request->unidade) . " em alistamento.");
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['status' => 'error', 'message' => $e->getMessage()], 422);
            }
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
 
    /**
     * Trocar base selecionada.
     */
    public function switchBase($id)
    {
        $base = Base::where('id', $id)->where('jogador_id', Auth::id())->firstOrFail();
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
        if ($base->jogador_id !== Auth::id()) abort(403);
 
        try {
            $this->gameService->atualizarRecursos($base);

            $custo = 300;
            $ganho = 100;
            
            \Illuminate\Support\Facades\DB::transaction(function () use ($base, $request, $custo, $ganho) {
                if ($this->gameService->consumirRecursos($base, [$request->oferece => $custo])) {
                    // Adicionar recurso recebido directamente na tabela recursos
                    if ($base->recursos) {
                        $base->recursos->increment($request->recebe, $ganho);
                    }
                } else {
                    throw new \Exception('Recursos insuficientes para a troca no Mercado Negro.');
                }
            });
            return redirect()->back()->with('success', 'TRANSAÇÃO NO MERCADO NEGRO: Recursos trocados com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
