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
            $convites = \App\Models\ConviteAlianca::with('alianca', 'convidadoPor')
                ->where('jogador_id', Auth::id())
                ->where('status', 'pendente')
                ->get();

            return Inertia::render('alianca', [
                'temAlianca' => false,
                'aliancas' => $aliancas,
                'pedidoPendente' => $pedidoPendente,
                'convites' => $convites,
            ]);
        }

        $mensagens = $jogador->alianca->mensagens()->with('jogador')->latest()->take(50)->get()->reverse()->values();
        $diplomacia = \App\Models\AliancaDiplomacia::with('alvoAlianca')
            ->where('alianca_id', $jogador->alianca_id)
            ->get();

        return Inertia::render('alianca', [
            'temAlianca' => true,
            'alianca' => $jogador->alianca,
            'jogador' => $jogador,
            'mensagens' => $mensagens,
            'convitesEnviados' => \App\Models\ConviteAlianca::with('jogador')
                ->where('alianca_id', $jogador->alianca_id)
                ->where('status', 'pendente')
                ->get(),
            'diplomacia' => $diplomacia,
            'todasAliancas' => Alianca::where('id', '!=', $jogador->alianca_id)->get()
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

    public function convidar(Request $request)
    {
        $request->validate([
            'jogador_nome' => 'required|string|exists:jogadores,username',
        ]);

        $jogadorAlvo = Jogador::where('username', $request->jogador_nome)->first();
        $me = Jogador::find(Auth::id());

        if (!$me->alianca_id) abort(403);
        if ($jogadorAlvo->alianca_id) return back()->withErrors(['error' => 'Este comandante já pertence a uma coligação.']);

        \App\Models\ConviteAlianca::updateOrCreate([
            'alianca_id' => $me->alianca_id,
            'jogador_id' => $jogadorAlvo->id,
            'convidado_por_id' => $me->id,
            'status' => 'pendente'
        ]);

        return back()->with('success', "Protocolo de convite enviado para {$jogadorAlvo->username}.");
    }

    public function decidirConvite($id, $decisao)
    {
        $convite = \App\Models\ConviteAlianca::findOrFail($id);
        if ($convite->jogador_id !== Auth::id()) abort(403);

        if ($decisao === 'aceitar') {
            $jogador = Jogador::find(Auth::id());
            $jogador->update(['alianca_id' => $convite->alianca_id]);
            $convite->update(['status' => 'aceite']);
            
            // Limpar outros convites e pedidos
            \App\Models\ConviteAlianca::where('jogador_id', $jogador->id)->where('status', 'pendente')->delete();
            PedidoAlianca::where('jogador_id', $jogador->id)->where('status', 'pendente')->delete();
        } else {
            $convite->update(['status' => 'rejeitado']);
        }

        return back()->with('success', 'Diplomacia processada.');
    }

    public function diplomaciaStore(Request $request)
    {
        $jogador = Jogador::find(Auth::id());
        $alianca = Alianca::find($jogador->alianca_id);
        if ($alianca->fundador_id !== $jogador->id) abort(403);

        $request->validate([
            'alvo_alianca_id' => 'required|exists:aliancas,id',
            'tipo' => 'required|in:aliado,pna,inimigo'
        ]);

        \App\Models\AliancaDiplomacia::updateOrCreate(
            ['alianca_id' => $alianca->id, 'alvo_alianca_id' => $request->alvo_alianca_id],
            ['tipo' => $request->tipo]
        );

        return back()->with('success', 'Relação diplomática atualizada.');
    }

    public function diplomaciaDelete($id)
    {
        $jogador = Jogador::find(Auth::id());
        $relacao = \App\Models\AliancaDiplomacia::findOrFail($id);
        if ($relacao->alianca_id !== $jogador->alianca_id) abort(403);
        
        $alianca = Alianca::find($jogador->alianca_id);
        if ($alianca->fundador_id !== $jogador->id) abort(403);

        $relacao->delete();

        return back()->with('success', 'Relação diplomática dissolvida.');
    }
}
