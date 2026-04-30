<?php

namespace App\Http\Controllers;

use App\Application\UpgradeBuilding;
use App\Application\TrainUnits;
use App\Application\MarketTrade;
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
    private TrainUnits $trainUnits;
    private MarketTrade $marketTrade;
    private GameService $gameService;
    private \App\Services\BuildingQueueService $queueService;

    public function __construct(
        UpgradeBuilding $upgradeBuilding, 
        TrainUnits $trainUnits,
        MarketTrade $marketTrade,
        GameService $gameService,
        \App\Services\BuildingQueueService $queueService
    ) {
        $this->upgradeBuilding = $upgradeBuilding;
        $this->trainUnits = $trainUnits;
        $this->marketTrade = $marketTrade;
        $this->gameService = $gameService;
        $this->queueService = $queueService;
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
        try {
            $this->trainUnits->execute(
                Auth::user(),
                $request->base_id,
                $request->unidade,
                $request->quantidade
            );

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

        try {
            $this->marketTrade->execute(
                Auth::user(),
                $request->base_id,
                $request->oferece,
                $request->recebe
            );
            return redirect()->back()->with('success', 'TRANSAÇÃO NO MERCADO NEGRO: Recursos trocados com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
    public function cancelUpgrade(Request $request, $id)
    {
        try {
            $queueItem = \App\Models\BuildingQueue::findOrFail($id);
            $base = Base::findOrFail($queueItem->base_id);
            $this->authorize('update', $base);

            $this->queueService->cancelBuilding($id);

            return redirect()->back()->with('success', 'ORDEM CANCELADA: Recursos devolvidos ao depósito.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function moveUp(Request $request, $id)
    {
        try {
            $queueItem = \App\Models\BuildingQueue::findOrFail($id);
            $base = Base::findOrFail($queueItem->base_id);
            $this->authorize('update', $base);

            $this->queueService->moveUp($id);

            return redirect()->back()->with('success', 'PRIORIDADE REALTERADA: Projeto movido para cima.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function moveDown(Request $request, $id)
    {
        try {
            $queueItem = \App\Models\BuildingQueue::findOrFail($id);
            $base = Base::findOrFail($queueItem->base_id);
            $this->authorize('update', $base);

            $this->queueService->moveDown($id);

            return redirect()->back()->with('success', 'PRIORIDADE REALTERADA: Projeto movido para baixo.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * FASE UX: Inicializar base vazia manualmente.
     */
    public function bootstrap(Request $request)
    {
        $baseId = $request->input('base_id') ?? session('selected_base_id');
        $base = Base::findOrFail($baseId);
        $this->authorize('update', $base);

        if ($base->edificios()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'SÉRIE DE DADOS: A base já possui infraestrutura ativa.']);
        }

        \Illuminate\Support\Facades\DB::transaction(function() use ($base) {
            $base->edificios()->createMany([
                ['tipo' => \App\Domain\Building\BuildingType::HQ, 'nivel' => 1, 'pos_x' => 400, 'pos_y' => 300],
                ['tipo' => \App\Domain\Building\BuildingType::MURALHA, 'nivel' => 1, 'pos_x' => 400, 'pos_y' => 530],
                ['tipo' => \App\Domain\Building\BuildingType::MINA_SUPRIMENTOS, 'nivel' => 1, 'pos_x' => 268, 'pos_y' => 185],
                ['tipo' => \App\Domain\Building\BuildingType::MINA_METAL, 'nivel' => 1, 'pos_x' => 532, 'pos_y' => 185],
                ['tipo' => \App\Domain\Building\BuildingType::REFINARIA, 'nivel' => 1, 'pos_x' => 532, 'pos_y' => 415],
                ['tipo' => \App\Domain\Building\BuildingType::CENTRAL_ENERGIA, 'nivel' => 1, 'pos_x' => 400, 'pos_y' => 70],
                ['tipo' => \App\Domain\Building\BuildingType::FABRICA_MUNICOES, 'nivel' => 1, 'pos_x' => 135, 'pos_y' => 300],
                ['tipo' => \App\Domain\Building\BuildingType::HOUSING, 'nivel' => 1, 'pos_x' => 268, 'pos_y' => 415],
                ['tipo' => \App\Domain\Building\BuildingType::POSTO_RECRUTAMENTO, 'nivel' => 1, 'pos_x' => 665, 'pos_y' => 300],
                ['tipo' => \App\Domain\Building\BuildingType::ARMAZEM, 'nivel' => 1, 'pos_x' => 135, 'pos_y' => 185],
            ]);
        });

        return redirect()->back()->with('success', 'LOGÍSTICA REINSTALADA: Infraestrutura de Nível 1 operacional.');
    }
}
