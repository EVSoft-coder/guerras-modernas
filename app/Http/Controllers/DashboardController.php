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
    protected GameService $gameService;

    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) return redirect('/login');

        // 1. Obter Base Selecionada (com todas as relações)
        $bases = $user->bases()->with('recursos', 'edificios', 'buildingQueue', 'treinos', 'tropas')->get();
        $selectedBaseId = session('selected_base_id');
        $base = $bases->where('id', $selectedBaseId)->first() ?? $bases->first();

        if (!$base) return redirect('/login');

        // 2. TICK OBRIGATÓRIO — Calcular e PERSISTIR recursos na DB
        $this->gameService->tickResources($base);

        // 3. Processar filas de construção/treino completadas
        $this->gameService->processarFilas($base);

        // 4. RECARREGAR da DB após tick e processamento — DADOS REAIS
        $base->refresh();
        $base->load(['recursos', 'edificios', 'buildingQueue', 'treinos', 'tropas']);
        session(['selected_base_id' => $base->id]);

        // 5. Ler recursos DIRETO da relação (dados persistidos na DB)
        $recursos = $base->recursos;
        $resources = $recursos ? [
            'id'           => $recursos->id,
            'base_id'      => $recursos->base_id,
            'suprimentos'  => (float) $recursos->suprimentos,
            'combustivel'  => (float) $recursos->combustivel,
            'municoes'     => (float) $recursos->municoes,
            'metal'        => (float) $recursos->metal,
            'energia'      => (float) $recursos->energia,
            'pessoal'      => (float) $recursos->pessoal,
            'cap'          => (int) ($recursos->cap ?? 10000),
            'updated_at'   => $recursos->updated_at,
        ] : null;

        Log::info('RESOURCES SENT TO FRONTEND', $resources ?? ['EMPTY' => true]);

        // 6. Dados auxiliares
        $populacao = $this->gameService->obterEstatisticasPopulacao($base);
        $taxas = $this->gameService->obterTaxasProducao($base);
        $taxasPerSecond = collect($taxas)->map(fn($v) => (float)$v / 60)->toArray();

        // Filtragem: Apenas edifícios com nível > 0
        $base->setRelation('edificios', $base->edificios->filter(fn($e) => $e->nivel > 0));

        return Inertia::render('dashboard', [
            'jogador'          => $user,
            'base'             => $base,
            'bases'            => $bases,
            'buildings'        => $base->edificios ?? [],
            'population'       => $populacao,
            'resources'        => $resources,
            'taxas'            => $taxas,
            'taxasPerSecond'   => $taxasPerSecond,
            'populacao'        => $populacao,
            'relatorios'       => \App\Models\Relatorio::where('atacante_id', $user->id)
                ->orWhere('defensor_id', $user->id)
                ->latest()->take(10)->get() ?? [],
            'relatoriosGlobal' => \App\Models\Relatorio::latest()->take(10)->get() ?? [],
            'gameConfig'       => config('game'),
            'gameData'         => [
                'resources'  => $resources,
                'units'      => $base->tropas,
                'buildings'  => $base->edificios,
                'population' => $populacao,
                'movements'  => [
                    'sent'     => \App\Models\Ataque::where('origem_base_id', $base->id)->where('processado', false)->get() ?? [],
                    'received' => \App\Models\Ataque::where('destino_base_id', $base->id)->where('processado', false)->get() ?? [],
                    'queue'    => $base->buildingQueue,
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
