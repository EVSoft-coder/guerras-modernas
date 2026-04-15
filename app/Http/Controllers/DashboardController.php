<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GameService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Base;

class DashboardController extends Controller
{
    protected $gameService;

    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }

    public function index(Request $request)
    {
        $jogador = Auth::user();
        if (!$jogador) return redirect('/login');

        // 1. Obter Base Selecionada
        $bases = $jogador->bases()->with('recursos', 'edificios', 'construcoes', 'treinos', 'tropas')->get();
        $selectedBaseId = session('selected_base_id');
        $base = $bases->where('id', $selectedBaseId)->first() ?? $bases->first();

        $populacao = null;

        if ($base) {
            // CORREÇÃO FORÇADA 4.3.4 — TICK DE RECURSOS E PERSISTÊNCIA TOTAL
            $this->gameService->tickRecursos($base);

            // PROCESSAMENTO DETERMINÍSTICO DE FILAS
            $this->gameService->processarFilas($base);
            
            session(['selected_base_id' => $base->id]);
            $base->refresh();
            $base->load(['recursos', 'edificios', 'construcoes', 'treinos', 'tropas']);
  
            $populacao = $this->gameService->obterEstatisticasPopulacao($base);

            // Filtragem de Soberania
            $base->setRelation('edificios', $base->edificios->filter(fn($e) => $e->nivel > 0));
        }

        // 🚨 AUDITORIA DE RECURSOS FORÇADA E EXPLÍCITA
        $resources = $base?->recursos ? $base->recursos->fresh()->toArray() : null;
        Log::info('RESOURCES SENT TO FRONTEND', ['resources' => $resources]);

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
            'relatorios' => \App\Models\Relatorio::where('atacante_id', $jogador->id)
                ->orWhere('defensor_id', $jogador->id)
                ->latest()->take(10)->get() ?? [],
            'relatoriosGlobal' => \App\Models\Relatorio::latest()->take(10)->get() ?? [],
            'gameConfig' => config('game'),
            'gameData' => [
                'resources' => $resources,
                'units' => $base?->tropas,
                'buildings' => $base?->edificios,
                'population' => $populacao,
                'movements' => [
                    'sent' => \App\Models\Ataque::where('origem_base_id', $base?->id)->where('processado', false)->get() ?? [],
                    'received' => \App\Models\Ataque::where('destino_base_id', $base?->id)->where('processado', false)->get() ?? [],
                ],
                'rebels' => Base::whereNull('jogador_id')->with('recursos')->get()->map(function($b) {
                    return array_merge($b->toArray(), [
                        'calculated_resources' => $this->gameService->calculateResources($b),
                    ]);
                }),
            ]
        ]);
    }
}
