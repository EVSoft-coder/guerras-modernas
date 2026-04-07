<?php

namespace App\Http\Controllers;

use App\Models\Base;
use App\Models\Ataque;
use App\Services\GameService;
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
    public function upgrade(Request $request)
    {
        $request->validate([
            'base_id' => 'required|exists:bases,id',
            'tipo' => 'required|string'
        ]);

        $base = Base::findOrFail($request->base_id);
        
        // Verificar dono
        if ($base->jogador_id !== Auth::id()) abort(403);

        try {
            $this->gameService->iniciarConstrucao($base, $request->tipo);
            return redirect()->back()->with('success', "Upgrade iniciado para {$request->tipo}!");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Iniciar recrutamento de tropas.
     */
    public function treinar(Request $request)
    {
        $request->validate([
            'base_id' => 'required|exists:bases,id',
            'unidade' => 'required|string',
            'quantidade' => 'required|integer|min:1'
        ]);

        $base = Base::findOrFail($request->base_id);
        if ($base->jogador_id !== Auth::id()) abort(403);

        try {
            $this->gameService->iniciarTreino($base, $request->unidade, $request->quantidade);
            return redirect()->back()->with('success', "Treino de {$request->quantidade}x {$request->unidade} iniciado!");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Lançar um ataque/operação militar.
     */
    public function atacar(Request $request)
    {
        $request->validate([
            'origem_id' => 'required|exists:bases,id',
            'destino_id' => 'required|exists:bases,id',
            'tropas' => 'required|array',
            'tipo' => 'required|in:saque,conquista,reforco,espionagem'
        ]);

        $origem = Base::findOrFail($request->origem_id);
        if ($origem->jogador_id !== Auth::id()) abort(403);

        $destino = Base::findOrFail($request->destino_id);
        
        // Lógica de tempo de viagem baseada na distância
        $distancia = sqrt(pow($destino->coordenada_x - $origem->coordenada_x, 2) + pow($destino->coordenada_y - $origem->coordenada_y, 2));
        
        $speed = config('game.speed.travel', 1);
        $segundos = ($distancia * 100) / $speed; // Ajuste para Speed Mode
        $chegadaEm = now()->addSeconds($segundos);

        // Criar registro do ataque
        Ataque::create([
            'origem_base_id'  => $origem->id,
            'destino_base_id' => $destino->id,
            'tropas'          => $request->tropas,
            'tipo'            => $request->tipo,
            'chegada_em'      => $chegadaEm,
        ]);

        return redirect()->route('dashboard')->with('success', "Operação lançada! Chegada estimada às {$chegadaEm->format('H:i:s')}");
    }
}
