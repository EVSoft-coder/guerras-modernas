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
            'jogador' => $jogador->name,
            'data' => $msg->created_at->format('H:i'),
            'mensagem' => $msg->mensagem
        ]);
    }
}
