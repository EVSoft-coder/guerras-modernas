<?php

namespace App\Http\Controllers;

use App\Models\Base;
use App\Models\Pesquisa;
use App\Services\GameService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PesquisaController extends Controller
{
    protected $gameService;

    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }

    public function pesquisar(Request $request)
    {
        $request->validate([
            'base_id' => 'required|exists:bases,id',
            'tipo' => 'required|string'
        ]);

        $base = Base::findOrFail($request->base_id);
        if ($base->jogador_id !== Auth::id()) abort(403);

        try {
            $pesquisa = $this->gameService->iniciarPesquisa($base, $request->tipo);
            return redirect()->back()->with('success', "PROTOCOLO DE I&D: Projeto {$request->tipo} iniciado com sucesso.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
