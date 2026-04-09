<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;

class LogController extends Controller
{
    /**
     * Exibe a consola de logs do sistema.
     */
    public function index()
    {
        // Segurança básica: Apenas ID 1 ou admin (pode ajustar depois)
        if (Auth::id() != 1) {
            abort(403, 'Acesso restrito ao Comandante Supremo.');
        }

        return view('admin.console_logs');
    }

    /**
     * Retorna as últimas linhas do log via AJAX.
     */
    public function fetch(Request $request)
    {
        if (Auth::id() != 1) return response()->json(['error' => 'Unauthorized'], 403);

        $path = storage_path('logs/laravel.log');
        
        if (!File::exists($path)) {
            return response()->json(['content' => 'Nenhum log encontrado.']);
        }

        // Ler as últimas 200 linhas
        $content = File::get($path);
        $lines = explode("\n", $content);
        $lastLines = array_slice($lines, -200);
        
        return response()->json([
            'content' => implode("\n", $lastLines),
            'last_update' => now()->format('H:i:s')
        ]);
    }

    /**
     * Limpa o ficheiro de logs.
     */
    public function clear()
    {
        if (Auth::id() != 1) abort(403);
        
        File::put(storage_path('logs/laravel.log'), '');
        return redirect()->back()->with('success', 'Log limpo com sucesso.');
    }
}
