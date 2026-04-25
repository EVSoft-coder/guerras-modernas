<?php

namespace App\Http\Controllers;

use App\Models\Mensagem;
use App\Models\Jogador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MensagemController extends Controller
{
    /**
     * Caixa de entrada do jogador.
     */
    public function index(Request $request)
    {
        $jogadorId = Auth::id();
        $tipo = $request->input('tipo', 'todas');

        $query = Mensagem::with('remetente:id,username')
            ->where('destinatario_id', $jogadorId)
            ->orderByDesc('created_at');

        if ($tipo !== 'todas') {
            $query->where('tipo', $tipo);
        }

        $mensagens = $query->paginate(20);

        $naoLidas = Mensagem::where('destinatario_id', $jogadorId)
            ->where('lida', false)
            ->count();

        return Inertia::render('mensagens', [
            'mensagens' => $mensagens,
            'naoLidas' => $naoLidas,
            'filtroAtivo' => $tipo,
        ]);
    }

    /**
     * Ver uma mensagem específica e marcar como lida.
     */
    public function show(int $id)
    {
        $mensagem = Mensagem::with('remetente:id,username')
            ->where('destinatario_id', Auth::id())
            ->findOrFail($id);

        if (!$mensagem->lida) {
            $mensagem->update(['lida' => true]);
        }

        return response()->json($mensagem);
    }

    /**
     * Enviar mensagem privada.
     */
    public function enviar(Request $request)
    {
        $request->validate([
            'destinatario' => 'required|string|max:100',
            'assunto' => 'required|string|max:255',
            'corpo' => 'required|string|max:5000',
        ]);

        $destinatario = Jogador::where('username', $request->destinatario)->first();
        if (!$destinatario) {
            return back()->withErrors(['destinatario' => 'Jogador não encontrado.']);
        }

        if ($destinatario->id === Auth::id()) {
            return back()->withErrors(['destinatario' => 'Não podes enviar mensagens a ti mesmo.']);
        }

        Mensagem::create([
            'remetente_id' => Auth::id(),
            'destinatario_id' => $destinatario->id,
            'assunto' => $request->assunto,
            'corpo' => $request->corpo,
            'tipo' => 'privada',
        ]);

        return back()->with('success', 'Mensagem enviada.');
    }

    /**
     * Apagar mensagem.
     */
    public function apagar(int $id)
    {
        Mensagem::where('destinatario_id', Auth::id())
            ->where('id', $id)
            ->delete();

        return back()->with('success', 'Mensagem eliminada.');
    }

    /**
     * Marcar todas como lidas.
     */
    public function marcarTodasLidas()
    {
        Mensagem::where('destinatario_id', Auth::id())
            ->where('lida', false)
            ->update(['lida' => true]);

        return back()->with('success', 'Todas as mensagens marcadas como lidas.');
    }

    /**
     * Contagem de não lidas para o badge do sidebar.
     */
    public function naoLidasCount()
    {
        $count = Mensagem::where('destinatario_id', Auth::id())
            ->where('lida', false)
            ->count();

        return response()->json(['count' => $count]);
    }
}
