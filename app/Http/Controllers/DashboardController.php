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
    public function index(Request $request)
    {
        $user = $request->user();
        $base = $user->bases()->first();
        
        // TICK OBRIGATÓRIO
        app(GameService::class)->tickResources($base);
        
        $resources = $base->recursos->fresh()->toArray();
        
        Log::info('RESOURCES SENT TO FRONTEND', $resources);

        // Obter dados auxiliares para não quebrar a UI
        $bases = $user->bases()->with('recursos', 'edificios', 'construcoes', 'treinos', 'tropas')->get();
        $selectedBaseId = session('selected_base_id');
        $base = $bases->where('id', $selectedBaseId)->first() ?? $bases->first();

        // Processamentos adicionais
        app(GameService::class)->processarFilas($base);
        $base->refresh();
        $base->load(['recursos', 'edificios', 'construcoes', 'treinos', 'tropas']);
        $populacao = app(GameService::class)->obterEstatisticasPopulacao($base);
        $base->setRelation('edificios', $base->edificios->filter(fn($e) => $e->nivel > 0));

        return Inertia::render('dashboard', [
            'jogador' => $user,
            'base' => $base,
            'bases' => $bases,
            'buildings' => $base->edificios ?? [],
            'population' => $populacao ?? null,
            'resources' => $resources,
            'taxas' => app(GameService::class)->obterTaxasProducao($base),
            'taxasPerSecond' => collect(app(GameService::class)->obterTaxasProducao($base))->map(fn($v) => (float)$v / 60)->toArray(),
            'populacao' => $populacao ?? null,
            'relatorios' => \App\Models\Relatorio::where('atacante_id', $user->id)
                ->orWhere('defensor_id', $user->id)
                ->latest()->take(10)->get() ?? [],
            'relatoriosGlobal' => \App\Models\Relatorio::latest()->take(10)->get() ?? [],
            'gameConfig' => config('game'),
            'gameData' => [
                'resources' => $resources,
                'units' => $base->tropas,
                'buildings' => $base->edificios,
                'population' => $populacao,
                'movements' => [
                    'sent' => \App\Models\Ataque::where('origem_base_id', $base->id)->where('processado', false)->get() ?? [],
                    'received' => \App\Models\Ataque::where('destino_base_id', $base->id)->where('processado', false)->get() ?? [],
                ],
                'rebels' => Base::whereNull('jogador_id')->with('recursos')->get()->map(function($b) {
                    return array_merge($b->toArray(), [
                        'calculated_resources' => app(GameService::class)->calculateResources($b),
                    ]);
                }),
            ]
        ]);
    }
}
