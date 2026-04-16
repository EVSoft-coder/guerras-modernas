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
            // Garante que o usuário tem as bases carregadas
            if (!$user->wasRecentlyCreated && $user->bases) {
                foreach ($user->bases as $base) {
                    $this->gameService->tickResources($base);
                }
                Log::info('Tick executed for user ' . $user->id);
            }
        }

        return $next($request);
    }
}
