<?php

namespace App\Http\Controllers;

use App\Models\Base;
use App\Models\Ataque;
use App\Services\GameService;
use App\Http\Requests\BuildingUpgradeRequest;
use App\Http\Requests\TreinarRequest;
use App\Http\Requests\AtacarRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BaseController extends Controller
{
    protected $gameService;

    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }

    /**
     * Iniciar um upgrade de edifício.
     */
    public function upgrade(BuildingUpgradeRequest $request)
    {
        $base = Base::findOrFail($request->base_id);
        
        // Verificar dono
        if ($base->jogador_id !== Auth::id()) abort(403);

        try {
            $fila = $this->gameService->iniciarConstrucao($base, $request->tipo);
            return redirect()->back()->with('success', "ORDEM DE ENGENHARIA: Upgrade de {$request->tipo} iniciado com sucesso.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Iniciar recrutamento de tropas.
     */
    public function treinar(TreinarRequest $request)
    {
        $base = Base::findOrFail($request->base_id);
        if ($base->jogador_id !== Auth::id()) abort(403);

        try {
            \Illuminate\Support\Facades\DB::transaction(function() use ($base, $request) {
                return $this->gameService->iniciarTreino($base, $request->unidade, $request->quantidade);
            });

            return redirect()->back()->with('success', "ORDEM DE RECRUTAMENTO: {$request->quantidade}x {$request->unidade} em alistamento.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Lançar um ataque/operação militar.
     */
    public function atacar(AtacarRequest $request)
    {
        $origem = Base::findOrFail($request->origem_id);
        if ($origem->jogador_id !== Auth::id()) abort(403);

        $destino = Base::findOrFail($request->destino_id);
        
        // REGRAS DE ENGAJAMENTO: Proteção de Novatos
        if ($destino->jogador->sobProtecao()) {
            return redirect()->back()->withErrors(['error' => 'ALVO PROTEGIDO: O comandante inimigo ainda está em período de alistamento inicial (Proteção de Novato).']);
        }
        
        // Lógica de tempo de viagem baseada na distância e na UNIDADE MAIS LENTA
        $distancia = sqrt(pow($destino->coordenada_x - $origem->coordenada_x, 2) + pow($destino->coordenada_y - $origem->coordenada_y, 2));
        
        $unidadesConf = config('game.units');
        $minSpeed = 999;
        $tropaEnviada = false;

        foreach ($request->tropas as $unidade => $quantidade) {
            if ($quantidade > 0) {
                $tropaEnviada = true;
                $velUnidade = $unidadesConf[$unidade]['speed'] ?? 10;
                if ($velUnidade < $minSpeed) {
                    $minSpeed = $velUnidade;
                }
            }
        }

        if (!$tropaEnviada) {
            return redirect()->back()->withErrors(['error' => 'MOBILIZAÇÃO INVÁLIDA: Selecione pelo menos uma unidade para a operação.']);
        }

        $speed = $minSpeed;
        
        // APLICAR TECH: Logística Avançada (+10% velocidade por nível)
        $nivelLogistica = Auth::user()->obterNivelTech('logistica');
        $multiplicadorVel = 1 + ($nivelLogistica * 0.10);
        $speed *= $multiplicadorVel;

        $segundos = ($distancia * 100) / max(1, $speed); // Ajuste para Speed Mode
        $chegadaEm = now()->addSeconds($segundos);

        try {
            \Illuminate\Support\Facades\DB::transaction(function() use ($origem, $destino, $request, $chegadaEm) {
                // VALIDAR INVENTÁRIO TÁTICO: Garantir que as tropas existem e retirá-las da base no lançamento
                foreach ($request->tropas as $unidade => $quantidade) {
                    if ($quantidade <= 0) continue;
                    
                    $tropaLocal = $origem->tropas()->where('unidade', $unidade)->lockForUpdate()->first();
                    if (!$tropaLocal || $tropaLocal->quantidade < $quantidade) {
                        throw new \Exception("Tropas insuficientes: {$unidade}");
                    }
                    
                    // Retirar do inventário (Estado de Trânsito)
                    $tropaLocal->decrement('quantidade', $quantidade);
                }

                // Criar registro do ataque
                Ataque::create([
                    'origem_base_id'  => $origem->id,
                    'destino_base_id' => $destino->id,
                    'tropas'          => $request->tropas,
                    'tipo'            => $request->tipo,
                    'chegada_em'      => $chegadaEm,
                ]);
            });

            return redirect()->route('dashboard')->with('success', "Operação lançada! Chegada estimada às {$chegadaEm->format('H:i:s')}");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function cancelarAtaque($id)
    {
        $atq = Ataque::findOrFail($id);
        $origem = Base::findOrFail($atq->origem_base_id);
        
        if ($origem->jogador_id !== Auth::id()) abort(403);
        if ($atq->processado) return redirect()->back()->withErrors(['error' => 'Ataque já processado.']);

        // DEVOLVER TROPAS
        foreach ($atq->tropas as $unidade => $quantidade) {
            $tropaLocal = $origem->tropas()->firstOrCreate(['unidade' => $unidade]);
            $tropaLocal->increment('quantidade', $quantidade);
        }

        $atq->delete();

        return redirect()->back()->with('success', 'Operação abortada. Tropas regressaram à base.');
    }

    public function switchBase($id)
    {
        $base = Base::where('id', $id)->where('jogador_id', Auth::id())->firstOrFail();
        session(['selected_base_id' => $base->id]);
        return redirect()->route('dashboard')->with('success', "Comando transferido para {$base->nome}!");
    }

    /**
     * Efetuar troca de recursos no Mercado Negro (Taxa 3:1).
     */
    public function trocar(Request $request)
    {
        $request->validate([
            'base_id' => 'required|exists:bases,id',
            'oferece' => 'required|string',
            'recebe'  => 'required|string'
        ]);

        $base = Base::findOrFail($request->base_id);
        if ($base->jogador_id !== Auth::id()) abort(403);

        if ($request->oferece === $request->recebe) {
            return response()->json(['success' => false, 'error' => 'Operação redundante detectada.'], 422);
        }

        $custo = 300;
        $ganho = 100;

        $recursos = $base->recursos;
        if ($recursos->{$request->oferece} < $custo) {
            return response()->json(['success' => false, 'error' => 'Suprimentos insuficientes para esta transação clandestina.'], 422);
        }

        $recursos->decrement($request->oferece, $custo);
        $recursos->increment($request->recebe, $ganho);

        return redirect()->back()->with('success', 'TRANSAÇÃO NO MERCADO NEGRO: Recursos trocados com sucesso.');
    }

    public function manualProcess()
    {
        \Illuminate\Support\Facades\Artisan::call('game:processar-batalhas');
        return redirect()->back()->with('success', "Motor de Guerra Processado com Sucesso!");
    }

    /**
     * Endpoint AJAX para simulação de batalha.
     */
    public function simular(Request $request, \App\Services\CombatService $combatService)
    {
        $request->validate([
            'atacante' => 'required|array',
            'defensor' => 'required|array',
            'base_destino_id' => 'nullable|exists:bases,id'
        ]);

        $resultado = $combatService->simular(
            $request->atacante,
            $request->defensor,
            $request->base_destino_id
        );

        return response()->json($resultado);
    }
}
