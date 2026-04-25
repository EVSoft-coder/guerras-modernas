<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (config('app.env') === 'production' || str_contains(config('app.url'), 'https')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        \App\Models\Base::observe(\App\Observers\BaseObserver::class);

        // Gate de Admin — permite acesso às rotas /mw-* (deploy, NPC, etc.)
        Gate::define('admin-only', function ($user) {
            return in_array(strtolower($user->username), ['admin']);
        });
    }
}
