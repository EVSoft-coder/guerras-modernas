<?php

namespace App\Http\Controllers;

use App\Models\Alianca;
use App\Models\Jogador;
use App\Models\PedidoAlianca;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AliancaController extends Controller
{
    public function index()
    {
        $jogador = Jogador::with(['alianca.membros', 'alianca.fundador', 'alianca.pedidos.jogador'])->find(Auth::id());
        
        if (!$jogador->alianca) {
            $aliancas = Alianca::withCount('membros')->get();
            $pedidoPendente = PedidoAlianca::where('jogador_id', Auth::id())->where('status', 'pendente')->first();
            return Inertia::render('alianca', [
                'temAlianca' => false,
                'aliancas' => $aliancas,
                'pedidoPendente' => $pedidoPendente,
            ]);
        }

        $mensagens = $jogador->alianca->mensagens()->with('jogador')->latest()->take(50)->get()->reverse()->values();

        return Inertia::render('alianca', [
            'temAlianca' => true,
            'alianca' => $jogador->alianca,
            'jogador' => $jogador,
            'mensagens' => $mensagens
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

    public function pedir(Request $request)
    {
        $request->validate(['alianca_id' => 'required|exists:aliancas,id']);
        
        if (Jogador::find(Auth::id())->alianca_id) {
            return back()->withErrors(['error' => 'Já pertences a uma aliança.']);
        }

        if (PedidoAlianca::where('jogador_id', Auth::id())->where('status', 'pendente')->exists()) {
            return back()->withErrors(['error' => 'Já tens um pedido pendente.']);
        }

        PedidoAlianca::create([
            'jogador_id' => Auth::id(),
            'alianca_id' => $request->alianca_id,
            'status' => 'pendente'
        ]);

        return back()->with('success', 'Pedido de adesão enviado para o Comando Superior!');
    }

    public function decidir($id, $decisao)
    {
        $pedido = PedidoAlianca::with('alianca')->findOrFail($id);
        if ($pedido->alianca->fundador_id !== Auth::id()) abort(403);

        if ($decisao === 'aprovar') {
            $jogador = Jogador::find($pedido->jogador_id);
            $jogador->update(['alianca_id' => $pedido->alianca_id]);
            $pedido->update(['status' => 'aprovado']);
            
            // Limpar outros pedidos
            PedidoAlianca::where('jogador_id', $pedido->jogador_id)->where('status', 'pendente')->delete();
        } else {
            $pedido->update(['status' => 'rejeitado']);
        }

        return back()->with('success', 'Diplomacia processada com sucesso.');
    }

    public function sair()
    {
        $jogador = Jogador::find(Auth::id());
        $jogador->alianca_id = null;
        $jogador->save();

        return redirect()->route('alianca.index')->with('success', 'Saíste da aliança.');
    }
}
