<?php

namespace App\Http\Controllers;

use App\Models\Relatorio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RelatorioController extends Controller
{
    /**
     * Exibe os detalhes de um relatório de batalha.
     */
    public function show($id)
    {
        $relatorio = Relatorio::findOrFail($id);

        // Segurança: Apenas quem participou pode ler
        if ($relatorio->atacante_id !== Auth::id() && $relatorio->defensor_id !== Auth::id()) {
            abort(403, "Acesso negado aos arquivos de inteligência.");
        }

        return view('relatorio', compact('relatorio'));
    }

    /**
     * Exibe os detalhes de um relatório de batalha.
     */
    public function store(Request $request)
    {
        $report = Relatorio::create($request->all());
        return response()->json(['status' => 'SUCCESS', 'id' => $report->id]);
    }
}
