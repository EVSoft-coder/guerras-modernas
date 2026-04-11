<?php
 
namespace App\Http\Controllers;
 
use App\Models\Jogador;
use App\Models\Base;
use App\Services\EconomyService;
use App\Services\BuildingService;
use App\Services\UnitService;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
 
class AuthController extends Controller
{
    protected $economyService;
    protected $buildingService;
    protected $unitService;
 
    public function __construct(
        EconomyService $economyService,
        BuildingService $buildingService,
        UnitService $unitService
    ) {
        $this->economyService = $economyService;
        $this->buildingService = $buildingService;
        $this->unitService = $unitService;
    }
 
    // ====================== VIEWS ======================
    public function showLogin() { return view('auth.login'); }
    public function showRegister() { return view('auth.register'); }
    public function perfil() { return Inertia::render('perfil'); }
 
    // ====================== LOGIN/LOGOUT ======================
    public function login(LoginRequest $request)
    {
        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();
            return redirect('/dashboard');
        }
        return redirect()->back()->withErrors(['email' => 'Credenciais inválidas.']);
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
            // 2. Orquestração via Services (Sem lógica no Controller)
            $this->economyService->atualizarRecursos($base);
            $this->buildingService->processarFila($base);
            $this->unitService->processarFila($base);
            
            // 3. Persistência de Sessão
            session(['selected_base_id' => $base->id]);
            $base->refresh();
            $base->load(['recursos', 'edificios', 'construcoes', 'treinos', 'tropas']);
 
            // 4. Preparação de Dados para o HUD (Via EconomyService)
            $taxas = $this->economyService->obterTaxasProducao($base);
        }
 
        return Inertia::render('dashboard', [
            'jogador' => $jogador,
            'base' => $base,
            'bases' => $bases,
            'taxas' => $taxas ?? [],
            'taxasPerSecond' => $taxas ?? [],
            'relatorios' => \App\Models\Relatorio::where('atacante_id', $jogador->id)
                ->orWhere('defensor_id', $jogador->id)
                ->latest()->take(10)->get(),
            'ataquesRecebidos' => \App\Models\Ataque::where('destino_base_id', $base?->id)->where('processado', false)->get(),
            'ataquesEnviados' => \App\Models\Ataque::where('origem_base_id', $base?->id)->where('processado', false)->get(),
            'gameConfig' => config('game')
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
                ]);
 
                $base->recursos()->create([
                    'suprimentos' => 1000, 'combustivel' => 800, 'municoes' => 500, 'pessoal' => 300,
                ]);
 
                Auth::login($jogador);
                return redirect('/dashboard')->with('success', 'Comandante, a sua base está pronta.');
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Falha na mobilização: ' . $e->getMessage()]);
        }
    }
}
