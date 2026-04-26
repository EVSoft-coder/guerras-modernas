<?php

namespace App\Http\Controllers;

use App\Models\ForumTopico;
use App\Models\ForumPost;
use App\Models\Jogador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ForumController extends Controller
{
    public function index()
    {
        $jogador = Jogador::find(Auth::id());
        if (!$jogador->alianca_id) return redirect()->route('alianca.index');

        $topicos = ForumTopico::where('alianca_id', $jogador->alianca_id)
            ->with('jogador')
            ->orderBy('last_post_at', 'desc')
            ->get();

        return Inertia::render('Alianca/Forum/Index', [
            'topicos' => $topicos,
            'alianca' => $jogador->alianca
        ]);
    }

    public function storeTopico(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:200',
            'conteudo' => 'required|string'
        ]);

        $jogador = Jogador::find(Auth::id());
        
        $topico = ForumTopico::create([
            'alianca_id' => $jogador->alianca_id,
            'jogador_id' => $jogador->id,
            'titulo' => $request->titulo
        ]);

        ForumPost::create([
            'topico_id' => $topico->id,
            'jogador_id' => $jogador->id,
            'conteudo' => $request->conteudo
        ]);

        return redirect()->route('alianca.forum.show', $topico->id);
    }

    public function show($id)
    {
        $topico = ForumTopico::with(['jogador', 'posts.jogador', 'alianca'])->findOrFail($id);
        $jogador = Jogador::find(Auth::id());

        if ($topico->alianca_id !== $jogador->alianca_id) abort(403);

        return Inertia::render('Alianca/Forum/Show', [
            'topico' => $topico
        ]);
    }

    public function storePost(Request $request, $topicoId)
    {
        $request->validate(['conteudo' => 'required|string']);
        
        $topico = ForumTopico::findOrFail($topicoId);
        $jogador = Jogador::find(Auth::id());

        if ($topico->alianca_id !== $jogador->alianca_id) abort(403);

        ForumPost::create([
            'topico_id' => $topico->id,
            'jogador_id' => $jogador->id,
            'conteudo' => $request->conteudo
        ]);

        $topico->update(['last_post_at' => now()]);

        return back();
    }
}
