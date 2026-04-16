<?php

namespace App\Http\Controllers;

use App\Application\UpgradeBuilding;
use App\Models\Base;
use App\Http\Requests\BuildingUpgradeRequest;
use App\Http\Requests\TreinarRequest;
use App\Services\GameService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * BaseController - Controller "Magra" (Lean).
 * Gestão de operações básicas delegada à camada Application.
 */
class BaseController extends Controller
{
    private UpgradeBuilding $upgradeBuilding;
    private GameService $gameService;

    public function __construct(UpgradeBuilding $upgradeBuilding, GameService $gameService)
    {
        $this->upgradeBuilding = $upgradeBuilding;
        $this->gameService = $gameService;
    }

    /**
     * Iniciar um upgrade de edifício.
     */
    public function upgrade(BuildingUpgradeRequest $request)
    {
        try {
            $this->upgradeBuilding->execute(
                Auth::user(),
                $request->base_id,
                $request->tipo,
                $request->input('pos_x', 0),
                $request->input('pos_y', 0)
            );

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
     * (A ser movido para UnitQueue no futuro)
     */
    public function treinar(TreinarRequest $request)
    {
        $base = Base::findOrFail($request->base_id);
        $this->authorize('update', $base);

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
        $base = Base::findOrFail($id);
        $this->authorize('view', $base);

        session(['selected_base_id' => $base->id]);
        return redirect()->route('dashboard')->with('success', "Comando transferido para {$base->nome}!");
    }

    public function trocar(Request $request)
    {
        $request->validate([
            'base_id' => 'required|exists:bases,id',
            'oferece' => 'required|string',
            'recebe'  => 'required|string'
        ]);

        $base = Base::findOrFail($request->base_id);
        $this->authorize('update', $base);

        try {
            $this->gameService->syncResources($base);

            \Illuminate\Support\Facades\DB::transaction(function () use ($base, $request) {
                $custo = 300;
                $ganho = 100;
                if ($this->gameService->consumirRecursos($base, [$request->oferece => $custo])) {
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
