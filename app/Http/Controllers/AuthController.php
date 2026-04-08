<?php

namespace App\Http\Controllers;

use App\Models\Jogador;
use App\Models\Base;
use App\Models\Recurso;
use App\Models\Edificio;
use App\Models\Ataque;
use App\Services\GameService;
use App\Services\CombatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // ====================== REGISTO ======================
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:jogadores',
            'email'    => 'required|email|unique:jogadores',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Criar o jogador
        $jogador = Jogador::create([
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Criar a primeira base automaticamente
        $base = Base::create([
            'jogador_id'     => $jogador->id,
            'nome'           => 'Base Principal',
            'coordenada_x'   => rand(100, 900),   // coordenadas aleatórias iniciais
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

        // Criar edifícios básicos
        Edificio::create(['base_id' => $base->id, 'tipo' => 'QG', 'nivel' => 1]);
        Edificio::create(['base_id' => $base->id, 'tipo' => 'Quartel', 'nivel' => 1]);
        Edificio::create(['base_id' => $base->id, 'tipo' => 'Muralha', 'nivel' => 1]);

        // Fazer login automático
        Auth::login($jogador);

        return redirect('/dashboard')->with('success', 'Conta criada com sucesso! Bem-vindo ao Guerras Modernas!');
    }

    // ====================== LOGIN ======================
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect('/dashboard');
        }

        return redirect()->back()->withErrors(['email' => 'Credenciais inválidas.']);
    }

    // ====================== LOGOUT ======================
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Sessão terminada.');
    }

    // ====================== DASHBOARD ======================
    public function dashboard(Request $request)
    {
        $jogador = Auth::user();
        if (!$jogador) return redirect('/login');

        // Buscar todas as bases do jogador
        $bases = $jogador->bases()->with('recursos', 'edificios', 'construcoes', 'treinos')->get();
        
        // Determinar qual base exibir (via sessão ou primeira da lista)
        $selectedBaseId = session('selected_base_id');
        $base = $bases->where('id', $selectedBaseId)->first() ?? $bases->first();

        if ($base) {
            $gameService = new GameService();
            // Atualizar Recursos e Fila de Construção/Treino (sempre atualiza ao ver)
            $gameService->atualizarRecursos($base);
            $gameService->processarFila($base);
            $base->refresh();
            
            // Guardar o ID selecionado na sessão para persistência
            session(['selected_base_id' => $base->id]);
            
            // Obter taxas de produção p/min
            $taxas = $gameService->obterTaxasProducao($base);
        } else {
            $taxas = ['suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0, 'pessoal' => 0];
        }

        // Buscar últimos relatórios envolvidos
        $relatorios = \App\Models\Relatorio::where('atacante_id', $jogador->id)
            ->orWhere('defensor_id', $jogador->id)
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        $relatoriosGlobal = \App\Models\Relatorio::orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return view('dashboard', compact('jogador', 'base', 'bases', 'relatorios', 'relatoriosGlobal', 'taxas'));
    }
}