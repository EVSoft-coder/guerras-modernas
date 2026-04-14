<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return 'fixed-v1';
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'name' => $request->user()->name ?? $request->user()->username ?? $request->user()->nome ?? '',
                ]) : null,
            ],
            // Garantir que as props do dashboard tenham sempre valores default para evitar undefined no React
            'base' => null,
            'bases' => [],
            'jogador' => null,
            'taxasPerSecond' => [
                'suprimentos' => 0,
                'combustivel' => 0,
                'municoes' => 0,
                'pessoal' => 0
            ],
            'relatoriosGlobal' => [],
            'gameConfig' => config('game')
        ]);
    }
}

