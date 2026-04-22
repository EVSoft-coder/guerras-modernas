<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\GameService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TickResourcesMiddleware
{
    protected $gameService;

    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();

            // OTIMIZAÇÃO: Evitar processar todas as bases em cada POST/PUT/DELETE
            // O processamento ocorrerá organicamente nas ações ou no GET /dashboard
            if ($request->isMethod('GET') && !$user->wasRecentlyCreated && $user->bases) {
                foreach ($user->bases as $base) {
                    \App\Services\GameEngine::process($base);
                }
                Log::channel('game')->info('Middleware Tick executed for user ' . $user->id);
            }
        }

        return $next($request);
    }
}
