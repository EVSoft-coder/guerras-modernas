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
            $jogador = Auth::user();
            foreach ($jogador->bases as $base) {
                $base->ultimo_update = now();
                $base->save();
            }
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
        $bases = $jogador->bases()->with('recursos', 'edificios', 'construcoes', 'treinos', 'tropas')->get()
            ->map(function($b) {
                $b->setAttribute('resources', $this->gameService->calculateResources($b));
                return $b;
            });
        $selectedBaseId = session('selected_base_id');
        $base = $bases->where('id', $selectedBaseId)->first() ?? $bases->first();
 
        if ($base) {
            // 2. Orquestração via GameService (Centralizado)
            $this->gameService->atualizarRecursos($base);
            
            // Força a atualização do timestamp para garantir sincronia absoluta no próximo tick do cliente
            $base->ultimo_update = now();
            $base->save();

            $this->gameService->processarFilas($base);
            
            // 3. Persistência de Sessão e Recarga Real
            session(['selected_base_id' => $base->id]);
            $base->refresh();
            $base->load(['recursos', 'edificios', 'construcoes', 'treinos', 'tropas']);
 
            $taxas = $this->gameService->obterTaxasProducao($base);
            $populacao = $this->gameService->obterEstatisticasPopulacao($base);

            // Filtragem de Soberania: Apenas edifícios com nível > 0 são transmitidos pelo backend
            $base->setRelation('edificios', $base->edificios->filter(fn($e) => $e->nivel > 0));
        }
 
        // 5. Garantir Subsistência Rebelde (Mínimo 5)
        try {
            $rebelCount = Base::whereNull('jogador_id')->count();
            if ($rebelCount < 5 && $base) {
                for ($i = $rebelCount; $i < 5; $i++) {
                    $rebel = Base::create([
                        'jogador_id' => null,
                        'nome' => 'Reduto Insurgente ' . chr(65 + $i),
                        'coordenada_x' => $base->coordenada_x + rand(-5, 5),
                        'coordenada_y' => $base->coordenada_y + rand(-5, 5),
                        'qg_nivel' => rand(1, 5),
                        'muralha_nivel' => rand(1, 3),
                    ]);
                    $rebel->recursos()->create([
                        'suprimentos' => 5000, 'combustivel' => 5000, 'municoes' => 5000, 'pessoal' => 1000,
                    ]);
                }
            }
        } catch (\Exception $e) {
            \Log::error("Falha na mobilização insurgente: " . $e->getMessage());
        }

        return Inertia::render('dashboard', [
            'jogador' => $jogador,
            'base' => $base,
            'bases' => $bases,
            'buildings' => $base?->edificios ?? [],
            'population' => $populacao ?? null,
            'resources' => $base ? $this->gameService->calculateResources($base) : [],
            'taxas' => $taxas ?? [],
            'taxasPerSecond' => $taxas ?? [],
            'populacao' => $populacao ?? null,
            'relatorios' => \App\Models\Relatorio::where('atacante_id', $jogador->id)
                ->orWhere('defensor_id', $jogador->id)
                ->latest()->take(10)->get() ?? [],
            'relatoriosGlobal' => \App\Models\Relatorio::latest()->take(10)->get() ?? [],
            'gameConfig' => config('game'),
            // Payload optimizado para Polling
            'gameData' => [
                'resources' => $base ? $this->gameService->calculateResources($base) : null,
                'units' => $base?->tropas,
                'buildings' => $base?->edificios,
                'population' => $populacao,
                'movements' => [
                    'sent' => \App\Models\Ataque::where('origem_base_id', $base?->id)->where('processado', false)->get() ?? [],
                    'received' => \App\Models\Ataque::where('destino_base_id', $base?->id)->where('processado', false)->get() ?? [],
                ],
                'rebels' => Base::whereNull('jogador_id')->get()->map(function($b) {
                    $b->setAttribute('resources', $this->gameService->calculateResources($b));
                    return $b;
                }) ?? [],
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
 
                // Criação de Base Inicial
                $base = Base::create([
                    'jogador_id' => $jogador->id,
                    'nome' => 'Setor Primário',
                    'coordenada_x' => rand(100, 900),
                    'coordenada_y' => rand(100, 900),
                    'qg_nivel' => 1,
                    'muralha_nivel' => 1,
                    'recursos_metal' => 1000,
                    'recursos_energia' => 800,
                    'recursos_comida' => 500,
                    'last_update_at' => now(),
                ]);
 
                Auth::login($jogador);
                return redirect('/dashboard')->with('success', 'Comandante, a sua base está pronta.');
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Falha na mobilização: ' . $e->getMessage()]);
        }
    }
}
