<?php
 
namespace App\Http\Controllers;
 
use App\Models\Jogador;
use App\Models\Base;
use App\Services\GameService;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
 
class AuthController extends Controller
{
    protected $gameService;
 
    public function __construct(GameService $gameService) {
        $this->gameService = $gameService;
    }
 
    // ====================== VIEWS ======================
    public function showLogin() {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Auth/Login');
    }
    public function showRegister() { return view('auth.register'); }
    public function perfil() { return Inertia::render('perfil'); }
 
    // ====================== LOGIN/LOGOUT ======================
    public function login(LoginRequest $request)
    {
        if ($request->authenticate()) {
            $request->session()->regenerate();
        }

        return redirect()->intended('/dashboard');
    }
 
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/')->with('success', 'Sessão terminada.');
    }
 
    // ====================== DASHBOARD (REFACTORED) ======================
    public function dashboard(Request $request)
    {
        $jogador = Auth::user();
        if (!$jogador) return redirect('/login');
 
        // 1. Obter Base Selecionada
        $bases = $jogador->bases()->with('recursos', 'edificios', 'construcoes', 'treinos', 'tropas')->get();
        $selectedBaseId = session('selected_base_id');
        $base = $bases->where('id', $selectedBaseId)->first() ?? $bases->first();
 
        if ($base) {
            // CORREÇÃO FORÇADA 4.3.3 — TICK DE RECURSOS E PERSISTÊNCIA TOTAL
            $this->gameService->tickResources($base);

            // PROCESSAMENTO DETERMINÍSTICO DE FILAS
            $this->gameService->processarFilas($base);
            
            session(['selected_base_id' => $base->id]);
            $base->refresh();
            $base->load(['recursos', 'edificios', 'construcoes', 'treinos', 'tropas']);
  
            $populacao = $this->gameService->obterEstatisticasPopulacao($base);

            // Filtragem de Soberania
            $base->setRelation('edificios', $base->edificios->filter(fn($e) => $e->nivel > 0));

            // FASE 16: Garantir existência do General
            if (!$jogador->general) {
                $jogador->general()->create([
                    'nome' => 'General ' . $jogador->username,
                    'nivel' => 1,
                    'experiencia' => 0,
                    'pontos_skill' => 0,
                    'base_id' => $base->id,
                    'estatisticas' => ['ataque' => 10, 'defesa' => 10, 'saude' => 100],
                ]);
                $jogador->load('general');
            }
        }

        // 🚨 AUDITORIA DE RECURSOS FORÇADA
        $resources = $base?->recursos ? $base->recursos->fresh()->toArray() : null;
        \Illuminate\Support\Facades\Log::info('RESOURCES SENT TO FRONTEND', $resources ?? ['status' => 'NULL']);

        return Inertia::render('dashboard', [
            'jogador' => $jogador,
            'base' => $base,
            'bases' => $bases,
            'buildings' => $base?->edificios ?? [],
            'population' => $populacao ?? null,
            'resources' => $resources,
            'taxas' => $this->gameService->obterTaxasProducao($base),
            'taxasPerSecond' => collect($this->gameService->obterTaxasProducao($base))->map(fn($v) => (float)$v / 60)->toArray(),
            'populacao' => $populacao ?? null,
            'general' => $jogador->general()->with('skills')->first(),
            'relatorios' => \App\Models\Relatorio::where('atacante_id', $jogador->id)
                ->orWhere('defensor_id', $jogador->id)
                ->latest()->take(10)->get() ?? [],
            'relatoriosGlobal' => \App\Models\Relatorio::latest()->take(10)->get() ?? [],
            'gameConfig' => config('game'),
            // Payload optimizado para Polling
            'gameData' => [
                'resources' => $base ? $this->gameService->calculateResources($base) : null,
                'units' => $base?->units()->with('type')->get(),
                'buildings' => $base?->edificios,
                'population' => $populacao,
                'movements' => [
                    'sent' => \App\Models\Movement::where('origin_id', $base?->id)->where('status', 'moving')->get() ?? [],
                    'received' => \App\Models\Movement::where('target_id', $base?->id)->where('status', 'moving')->get() ?? [],
                ],
                'rebels' => Base::whereNull('jogador_id')->with('recursos')->get()->map(function($b) {
                    return array_merge($b->toArray(), [
                        'calculated_resources' => $this->gameService->calculateResources($b),
                    ]);
                }),
            ]
        ]);
    }
 
    // ====================== REGISTO ======================
    public function register(RegisterRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $jogador = Jogador::create([
                    'username' => $request->username,
                    'email'    => $request->email,
                    'password' => Hash::make($request->password),
                ]);
 
                // Criação de Base Inicial com Retry Tático (Passo 3 - Harden)
                $maxRetries = 20;
                $base = null;
                $mapService = app(\App\Services\MapService::class);

                for ($i = 0; $i < $maxRetries; $i++) {
                    try {
                        $coords = $mapService->generateBasePosition();
                        $base = Base::create([
                            'jogador_id' => $jogador->id,
                            'nome' => 'Setor Primário',
                            'x' => $coords['x'],
                            'y' => $coords['y'],
                            'coordenada_x' => $coords['x'],
                            'coordenada_y' => $coords['y'],
                            'ultimo_update' => now(),
                            'is_protected' => true,
                            'protection_until' => now()->addDays(3),
                        ]);

                        // FASE CRÍTICA — BOOTSTRAP DO JOGO: Infraestrutura inicial normalizada
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
                        ]);
                        break;
                    } catch (\Illuminate\Database\QueryException $e) {
                        // SQLSTATE 23000: Unique constraint violation
                        if ($e->getCode() == '23000' && $i < $maxRetries - 1) {
                            continue;
                        }
                        throw $e;
                    }
                }

                if (!$base) throw new \Exception("Falha ao localizar setor seguro após $maxRetries tentativas.");
                
                // Criar recursos iniciais na tabela recursos (fonte de verdade)
                $base->recursos()->firstOrCreate(['base_id' => $base->id], [
                    'suprimentos' => 500,
                    'combustivel' => 500,
                    'municoes' => 500,
                    'pessoal' => 300,
                    'metal' => 400,
                    'energia' => 400,
                    'storage_capacity' => 1000,
                ]);

                // FASE 16: Criar General Inicial
                $jogador->general()->create([
                    'nome' => 'General ' . $jogador->username,
                    'nivel' => 1,
                    'experiencia' => 0,
                    'pontos_skill' => 0,
                    'base_id' => $base->id,
                    'estatisticas' => ['ataque' => 10, 'defesa' => 10, 'saude' => 100],
                ]);
 
                Auth::login($jogador);
                return redirect('/dashboard')->with('success', 'Comandante, a sua base está pronta.');
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Falha na mobilização: ' . $e->getMessage()]);
        }
    }
}
