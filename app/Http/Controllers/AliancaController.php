<?php

namespace App\Http\Controllers;

use App\Models\Alianca;
use App\Models\Jogador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AliancaController extends Controller
{
    public function index()
    {
        $jogador = Jogador::with('alianca.membros', 'alianca.fundador')->find(Auth::id());
        
        if (!$jogador->alianca) {
            return view('alianca.create');
        }

        return view('alianca.index', [
            'alianca' => $jogador->alianca,
            'jogador' => $jogador
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:100|unique:aliancas',
            'tag' => 'required|string|max:10|unique:aliancas'
        ]);

        $alianca = Alianca::create([
            'nome' => $request->nome,
            'tag' => $request->tag,
            'fundador_id' => Auth::id()
        ]);

        $jogador = Jogador::find(Auth::id());
        $jogador->alianca_id = $alianca->id;
        $jogador->save();

        return redirect()->route('alianca.index')->with('success', 'Aliança fundada com sucesso!');
    }

    public function sair()
    {
        $jogador = Jogador::find(Auth::id());
        
        // Se for o fundador, a aliança é dissolvida (ou impede de sair)
        // Por simplicidade agora: apenas sai
        $jogador->alianca_id = null;
        $jogador->save();

        return redirect()->route('alianca.index')->with('success', 'Saíste da aliança.');
    }
}
