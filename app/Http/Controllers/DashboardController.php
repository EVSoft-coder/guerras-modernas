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
        try {
            // Log de início para depuração do 503
            \Log::info('[DASHBOARD_DEBUG] Starting index for user ' . (\Auth::id() ?? 'GUEST'));

            $user = $request->user();
            if (!$user) return redirect('/login');

            // Hack para servidores sem acesso ao terminal: Limpar cache de config em cada load de dashboard
            try { 
                \Illuminate\Support\Facades\Artisan::call('config:clear'); 
                // FASE 14: Sincronizar Arsenal Militar (Apenas se as novas unidades não existirem)
                if (\DB::table('unit_types')->count() < 5) {
                    $units = [
                        ['slug' => 'infantaria', 'nome' => 'Infantaria Ligeira', 'ataque' => 10, 'defesa' => 15, 'velocidade' => 10, 'capacidade' => 20, 'custo_suprimentos' => 50, 'custo_metal' => 10, 'custo_pessoal' => 1, 'tempo_treino' => 30],
                        ['slug' => 'blindado_apc', 'nome' => 'Blindado de Transporte (APC)', 'ataque' => 40, 'defesa' => 60, 'velocidade' => 30, 'capacidade' => 500, 'custo_suprimentos' => 200, 'custo_metal' => 150, 'custo_pessoal' => 3, 'tempo_treino' => 120],
                        ['slug' => 'tanque_combate', 'nome' => 'Tanque de Combate (MBT)', 'ataque' => 150, 'defesa' => 120, 'velocidade' => 25, 'capacidade' => 100, 'custo_suprimentos' => 500, 'custo_metal' => 800, 'custo_pessoal' => 4, 'tempo_treino' => 300],
                        ['slug' => 'artilharia_movel', 'nome' => 'Artilharia Móvel', 'ataque' => 250, 'defesa' => 30, 'velocidade' => 15, 'capacidade' => 50, 'custo_suprimentos' => 800, 'custo_metal' => 1200, 'custo_pessoal' => 5, 'tempo_treino' => 600],
                        ['slug' => 'politico', 'nome' => 'Comissário Político (Conquista)', 'ataque' => 1, 'defesa' => 1, 'velocidade' => 8, 'capacidade' => 0, 'custo_suprimentos' => 20000, 'custo_metal' => 15000, 'custo_pessoal' => 1, 'tempo_treino' => 3600],
                    ];

                    foreach ($units as $u) {
                        \DB::table('unit_types')->updateOrInsert(['slug' => $u['slug']], $u);
                    }
                }
                // FASE 11: Inserir NPCs (Células Rebeldes) se não existirem
                if (\App\Models\Jogador::where('username', 'REBELS')->count() === 0) {
                    $rebel = \App\Models\Jogador::create([
                        'username' => 'REBELS',
                        'email' => 'rebels@guerras.com',
                        'password' => \Illuminate\Support\Facades\Hash::make('no-login-' . uniqid()),
                    ]);

                    $locations = [
                        ['nome' => 'Posto Avançado Rebelde', 'x' => 505, 'y' => 505],
                        ['nome' => 'Depósito de Armas Insurrectas', 'x' => 495, 'y' => 510],
                        ['nome' => 'Acampamento Paramilitar', 'x' => 510, 'y' => 490],
                        ['nome' => 'Estação de Radar Rebelde', 'x' => 480, 'y' => 480],
                        ['nome' => 'Complexo de Treino Guerrilha', 'x' => 520, 'y' => 520],
                    ];

                    foreach ($locations as $loc) {
                        $base = \App\Models\Base::create([
                            'jogador_id' => $rebel->id,
                            'nome' => $loc['nome'],
                            'coordenada_x' => $loc['x'],
                            'coordenada_y' => $loc['y'],
                            'qg_nivel' => rand(3, 8),
                            'muralha_nivel' => rand(1, 4),
                            'loyalty' => 100,
                        ]);

                        \App\Models\Recurso::create([
                            'base_id' => $base->id,
                            'suprimentos' => rand(5000, 15000),
                            'combustivel' => rand(3000, 8000),
                            'municoes' => rand(10000, 25000),
                            'pessoal' => rand(1000, 5000),
                        ]);
                    }
                }
            } catch (\Exception $e) {
                \Log::error('SEED_FAILURE: ' . $e->getMessage());
            }

            // 1. Identificar Base Ativa
            $selectedBaseId = session('selected_base_id');
            $base = $user->bases()->find($selectedBaseId) ?? $user->bases()->first();

            if (!$base) return redirect('/login');

            // 2. Processar Motor (Escrita atómica permitida apenas no início do ciclo)
            GameEngine::process($base);

            // 3. Obter Snapshot Único (SSOT) - FASE BLOQUEANTE
            $state = $this->gameStateService->getVillageState($base->id);

            if (!$state) {
                throw new \Exception("SISTEMA: GameStateService falhou ao gerar o snapshot para o setor {$base->id}");
            }

            // 4. Salvar estado de sessão e Renderizar (Snapshot Único encapsulado)
            session(['selected_base_id' => $base->id]);

            $activeEvents = \App\Models\EventoMundo::ativos();

            return Inertia::render('dashboard', [
                'state' => $state,
                'base' => $state['base'],
                'resources' => $state['resources'],
                'buildings' => $state['buildings'],
                'activeEvents' => $activeEvents,
                'nobleInfo' => $state['nobleInfo']
            ]);
        } catch (\Exception $e) {
            \Log::error('[DASHBOARD_FATAL] ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
