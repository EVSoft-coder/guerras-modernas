<?php

namespace App\Http\Controllers;

use App\Models\Jogador;
use App\Models\Base;
use App\Models\Recurso;
use App\Models\Edificio;
use App\Models\Ataque;
use App\Services\GameService;
use App\Services\CombatService;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // ====================== VIEWS ======================
    public function showLogin() { return view('auth.login'); }
    public function showRegister() { return view('auth.register'); }
    public function perfil() { return view('dashboard'); } // Perfil por agora redireciona ou mostra dashboard

    // ====================== REGISTO ======================
    public function register(RegisterRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                // Criar o jogador
                $jogador = Jogador::create([
                    'username' => $request->username,
                    'email'    => $request->email,
                    'password' => Hash::make($request->password),
                    'xp'       => 0,
                    'nivel'    => 1,
                    'cargo'    => 'Recruta',
                ]);

                // Criar a primeira base automaticamente
                $base = Base::create([
                    'jogador_id'     => $jogador->id,
                    'nome'           => 'Base Principal',
                    'coordenada_x'   => rand(100, 900),
                    'coordenada_y'   => rand(100, 900),
                    'qg_nivel'       => 1,
                    'muralha_nivel'  => 1,
                ]);

                // Criar recursos iniciais
                Recurso::create([
                    'base_id'     => $base->id,
                    'suprimentos' => 1500,
                    'combustivel' => 1000,
                    'municoes'    => 800,
                    'pessoal'     => 600,
                ]);

                // Criar edifícios básicos (Usando os nomes corretos do config/game.php)
                // QG e Muralha estão nas colunas da base, mas os outros são registros em edifícios
                Edificio::create(['base_id' => $base->id, 'tipo' => 'mina_suprimentos', 'nivel' => 1]);
                Edificio::create(['base_id' => $base->id, 'tipo' => 'quartel', 'nivel' => 1]);
                Edificio::create(['base_id' => $base->id, 'tipo' => 'posto_recrutamento', 'nivel' => 1]);

                // Fazer login automático
                Auth::login($jogador);

                return redirect('/dashboard')->with('success', 'Conta de Oficial criada com sucesso! Bem-vindo ao Comando!');
            });
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Falha crítica ao mobilizar conta. Tente novamente.'])->withInput();
        }
    }

    // ====================== LOGIN ======================
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect('/dashboard');
        }

        return redirect()->back()->withErrors(['email' => 'Credenciais de oficial inválidas.']);
    }

    // ====================== LOGOUT ======================
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'SessÃ£o terminada.');
    }

    // ====================== DASHBOARD ======================
    public function dashboard(Request $request)
    {
        // Forçar Charset de Conexão
        \Illuminate\Support\Facades\DB::statement("SET NAMES 'utf8mb4'");
        
        $jogador = Auth::user();
        if (!$jogador) return redirect('/login');

        // Buscar todas as bases do jogador
        $bases = $jogador->bases()->with('recursos', 'edificios', 'construcoes', 'treinos')->get();
        
        // Determinar qual base exibir (via sessÃ£o ou primeira da lista)
        $selectedBaseId = session('selected_base_id');
        $base = $bases->where('id', $selectedBaseId)->first() ?? $bases->first();

        if ($base) {
            // AUTO-REPAIR: Assegurar que os recursos existem antes de carregar
            if (!$base->recursos()->exists()) {
                \App\Models\Recurso::create([
                    'base_id'     => $base->id,
                    'suprimentos' => 500,
                    'combustivel' => 500,
                    'municoes'    => 500,
                    'pessoal'     => 100,
                ]);
            }

            // Atualizar Recursos e Fila (Encapsulado no Trait e Service)
            $base->updateResources();
            $gameService = new GameService();
            $gameService->processarFila($base);
            
            // Recarregar com todas as dependÃªncias finais
            $base->refresh();
            $base->load(['recursos', 'edificios', 'construcoes', 'treinos', 'tropas']);
            
            // Guardar o ID selecionado na sessÃ£o para persistÃªncia
            session(['selected_base_id' => $base->id]);

            // Obter taxas de produção p/min via Trait
            $taxas = $base->getProductionRates();
            
            // Obter taxas p/segundo para o ticker do frontend
            $taxasPerSecond = [];
            foreach($taxas as $res => $minRate) {
                $taxasPerSecond[$res] = $minRate / 60;
            }

            // NOVAS VARIÃVEIS PARA O UI MODERNO (FASES 11-14)
            $intelLevel = $base->edificios()->where('tipo', 'radar_estrategico')->first()?->nivel ?? 0;
            
            // CÃ¡lculo de PopulaÃ§Ã£o/GuarniÃ§Ã£o
            $nivelRecrutamento = $base->edificios()->where('tipo', 'posto_recrutamento')->first()?->nivel ?? 0;
            $capacidadeBase = (100 * ($nivelRecrutamento + 1)) * 1.5;
            $nivelLogistica = $jogador->obterNivelTech('logistica');
            $multiplicadorCap = 1 + ($nivelLogistica * 0.10);
            $capTotal = $capacidadeBase * $multiplicadorCap;

            $popOcupada = 0;
            foreach ($base->tropas as $t) {
                $popOcupada += ($t->quantidade * (config("game.units.{$t->unidade}.cost.pessoal") ?? 1));
            }
            $popPercent = ($capTotal > 0) ? min(100, ($popOcupada / $capTotal) * 100) : 0;

            // Pesquisas em curso
            $pesquisasEmCurso = \App\Models\Pesquisa::where('jogador_id', $jogador->id)
                ->where('completado_em', '>', now())
                ->get();

            // Ataques
            $ataquesRecebidos = \App\Models\Ataque::where('destino_base_id', $base->id)->where('processado', false)->get();
            $ataquesEnviados = \App\Models\Ataque::where('origem_base_id', $base->id)->where('processado', false)->get();

        } else {
            $taxas = ['suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0, 'pessoal' => 0];
            $taxasPerSecond = $taxas;
            $intelLevel = 0;
            $popOcupada = 0;
            $capTotal = 0;
            $popPercent = 0;
            $pesquisasEmCurso = collect();
            $ataquesRecebidos = collect();
            $ataquesEnviados = collect();
        }

        // Buscar Ãºltimos relatÃ³rios envolvidos
        $relatorios = \App\Models\Relatorio::where('atacante_id', $jogador->id)
            ->orWhere('defensor_id', $jogador->id)
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        $relatoriosGlobal = \App\Models\Relatorio::orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return view('dashboard', compact(
            'jogador', 'base', 'bases', 'relatorios', 'relatoriosGlobal', 
            'taxas', 'taxasPerSecond', 'intelLevel', 'popOcupada', 
            'capTotal', 'popPercent', 'pesquisasEmCurso', 
            'ataquesRecebidos', 'ataquesEnviados'
        ));
    }
}
