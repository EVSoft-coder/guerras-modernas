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
    private SyncResources $syncResources;
    private GetDashboardData $getDashboardData;

    public function __construct(SyncResources $syncResources, GetDashboardData $getDashboardData)
    {
        $this->syncResources = $syncResources;
        $this->getDashboardData = $getDashboardData;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) return redirect('/login');

        // 1. Identificar Base Ativa
        $selectedBaseId = session('selected_base_id');
        $base = $user->bases()->find($selectedBaseId) ?? $user->bases()->first();

        if (!$base) return redirect('/login');

        // 2. Executar Lógica de Negócio (Sync)
        $this->syncResources->execute($base);

        // 3. Obter Dados de Vista
        $data = $this->getDashboardData->execute($user, $base->id);

        // 4. Salvar estado de sessão
        session(['selected_base_id' => $base->id]);

        return Inertia::render('dashboard', $data);
    }
}
