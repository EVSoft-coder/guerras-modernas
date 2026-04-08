<?php

namespace App\Http\Controllers;

use App\Models\MensagemAlianca;
use App\Models\Jogador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function enviar(Request $request)
    {
        $request->validate([
            'mensagem' => 'required|string|max:1000'
        ]);

        $jogador = Jogador::find(Auth::id());
        
        if (!$jogador->alianca_id) {
            return response()->json(['error' => 'Não pertences a uma aliança.'], 403);
        }

        $msg = MensagemAlianca::create([
            'alianca_id' => $jogador->alianca_id,
            'jogador_id' => $jogador->id,
            'mensagem' => $request->mensagem
        ]);

        return response()->json([
            'success' => true,
            'jogador' => $jogador->username ?? $jogador->name,
            'data' => $msg->created_at->format('H:i'),
            'mensagem' => $msg->mensagem
        ]);
    }

    public function buscar(Request $request)
    {
        $jogador = Jogador::find(Auth::id());
        if (!$jogador->alianca_id) return response()->json([]);

        $lastId = $request->query('last_id', 0);
        
        $mensagens = MensagemAlianca::with('jogador')
            ->where('alianca_id', $jogador->alianca_id)
            ->where('id', '>', $lastId)
            ->oldest()
            ->get()
            ->map(function($msg) {
                return [
                    'id' => $msg->id,
                    'jogador' => $msg->jogador->username ?? $msg->jogador->name,
                    'jogador_id' => $msg->jogador_id,
                    'mensagem' => $msg->mensagem,
                    'data' => $msg->created_at->format('H:i')
                ];
            });

        return response()->json($mensagens);
    }
}
