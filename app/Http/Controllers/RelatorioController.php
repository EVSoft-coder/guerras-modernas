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
        $jogador = Auth::user();
        $jogadorId = $jogador->id;

        $relatorios = Relatorio::where(function($q) use ($jogadorId) {
                $q->where('atacante_id', $jogadorId)
                  ->orWhere('defensor_id', $jogadorId);
            })
            ->with(['atacante', 'defensor'])
            ->orderBy('created_at', 'desc')
            ->get();

        $aliancaId = $jogador->alianca_id;
        $relatoriosAlianca = [];
        if ($aliancaId) {
            $relatoriosAlianca = Relatorio::where('partilhado_alianca', true)
                ->whereHas('atacante', function($q) use ($aliancaId) {
                    $q->where('alianca_id', $aliancaId);
                })
                ->where('atacante_id', '!=', $jogadorId)
                ->where('defensor_id', '!=', $jogadorId)
                ->with(['atacante', 'defensor'])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('Relatorios/Index', [
            'relatorios' => $relatorios,
            'relatoriosAlianca' => $relatoriosAlianca
        ]);
    }

    /**
     * Armazenar um novo relatório de batalha (vinda do motor ECS).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'atacante_id' => 'required|exists:jogadores,id',
            'defensor_id' => 'nullable|exists:jogadores,id',
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
        $jogador = Auth::user();

        // Verificar permissão: Dono, Alvo ou Aliança (se partilhado)
        $podeVer = $relatorio->atacante_id === $jogador->id || 
                   $relatorio->defensor_id === $jogador->id || 
                   ($relatorio->partilhado_alianca && $relatorio->atacante && $relatorio->atacante->alianca_id === $jogador->alianca_id);

        if (!$podeVer) abort(403);
        
        return Inertia::render('Relatorios/Show', [
            'relatorio' => $relatorio
        ]);
    }

    public function partilhar($id)
    {
        $relatorio = Relatorio::findOrFail($id);
        $jogadorId = Auth::user()->id;

        if ($relatorio->atacante_id !== $jogadorId && $relatorio->defensor_id !== $jogadorId) {
            abort(403);
        }

        $relatorio->update([
            'partilhado_alianca' => !$relatorio->partilhado_alianca
        ]);

        return back()->with('success', $relatorio->partilhado_alianca ? 'Relatório partilhado com a coligação.' : 'Partilha removida.');
    }
}
