<?php

namespace App\Http\Controllers;

use App\Models\Relatorio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RelatorioController extends Controller
{
    /**
     * Exibir a página de relatórios (Inertia).
     */
    public function index()
    {
        $jogadorId = Auth::user()->jogador->id;

        $relatorios = Relatorio::where('atacante_id', $jogadorId)
            ->orWhere('defensor_id', $jogadorId)
            ->with(['atacante', 'defensor'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Relatorios/Index', [
            'relatorios' => $relatorios
        ]);
    }

    /**
     * Armazenar um novo relatório de batalha (vinda do motor ECS).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'atacante_id' => 'required|exists:jogadores,id',
            'defensor_id' => 'required|exists:jogadores,id',
            'vitoria' => 'required|boolean',
            'dados' => 'required|array'
        ]);

        $relatorio = Relatorio::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Relatório de batalha arquivado.',
            'id' => $relatorio->id
        ]);
    }

    /**
     * Exibir detalhes de um relatório específico.
     */
    public function show($id)
    {
        $relatorio = Relatorio::with(['atacante', 'defensor'])->findOrFail($id);
        
        return Inertia::render('Relatorios/Show', [
            'relatorio' => $relatorio
        ]);
    }
}
