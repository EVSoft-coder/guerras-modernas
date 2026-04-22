<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GameStateService;
use App\Services\GameEngine;
use Inertia\Inertia;
use App\Models\Base;

/**
 * DashboardController - Controller "Magra" (Lean).
 * Delegas toda a lógica de negócio à camada Application.
 */
class DashboardController extends Controller
{
    protected $gameStateService;

    public function __construct(GameStateService $gameStateService)
    {
        $this->gameStateService = $gameStateService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) return redirect('/login');

        // Hack para servidores sem acesso ao terminal: Limpar cache de config em cada load de dashboard
        try { \Illuminate\Support\Facades\Artisan::call('config:clear'); } catch (\Exception $e) {}

        // 1. Identificar Base Ativa
        $selectedBaseId = session('selected_base_id');
        $base = $user->bases()->find($selectedBaseId) ?? $user->bases()->first();

        if (!$base) return redirect('/login');

        // 2. Processar Motor (Escrita atómica permitida apenas no início do ciclo)
        GameEngine::process($base);

        // 3. Obter Snapshot Único (SSOT)
        $state = $this->gameStateService->getVillageState($base->id);

        // 4. Dados Complementares (User/Context)
        $payload = array_merge($state, [
            'jogador' => $user,
            'bases'   => $user->bases()->with('recursos')->get(),
            'gameConfig' => config('game'),
            'unitTypes' => \App\Models\UnitType::all(),
            'myAllianceId' => $user->alianca_id,
        ]);

        // 5. Salvar estado de sessão
        session(['selected_base_id' => $base->id]);

        return Inertia::render('dashboard', $payload);
    }
}
