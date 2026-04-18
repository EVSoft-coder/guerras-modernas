<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Application\GetDashboardData;
use App\Application\SyncResources;
use Inertia\Inertia;
use App\Models\Base;

/**
 * DashboardController - Controller "Magra" (Lean).
 * Delegas toda a lógica de negócio à camada Application.
 */
class DashboardController extends Controller
{
    public function __construct(GetDashboardData $getDashboardData)
    {
        $this->getDashboardData = $getDashboardData;
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

        // 2. Obter Dados de Vista (O GetDashboardData já corre o GameEngine::process internamente)
        $data = $this->getDashboardData->execute($user, $base->id);

        // 3. Salvar estado de sessão
        session(['selected_base_id' => $base->id]);

        return Inertia::render('dashboard', $data);
    }
}
