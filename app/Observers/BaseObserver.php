<?php

namespace App\Observers;

use App\Models\Base;

class BaseObserver
{
    /**
     * Handle the Base "retrieved" event.
     * Sincroniza os recursos sempre que a base Ã© carregada para o dono.
     */
    public function retrieved(Base $base): void
    {
        // Apenas se houver um utilizador autenticado e for o dono da base
        // Evita correr em listagens massivas se o auth nÃ£o bater
        if (auth()->check() && auth()->id() === $base->jogador_id) {
            app(\App\Services\ResourceService::class)->sync($base);
        }
    }

    /**
     * Handle the Base "saving" event.
     * Garante que os recursos estÃ£o sincronizados antes de qualquer alteraÃ§Ã£o (ex: upgrade).
     */
    public function saving(Base $base): void
    {
        // Se a base jÃ¡ foi sincronizada neste request (evita loop infinito com o sync)
        if ($base->isDirty('ultimo_update') && count($base->getDirty()) === 1) {
            return;
        }

        app(\App\Services\ResourceService::class)->sync($base);
    }

    /**
     * Handle the Base "created" event.
     */
    public function created(Base $base): void
    {
        // Criar registo inicial de recursos se nÃ£o existir
        if (!$base->recursos) {
            $base->recursos()->create([
                'suprimentos' => 1000,
                'combustivel' => 800,
                'municoes' => 700,
                'pessoal' => 500,
                'metal' => 0,
                'energia' => 0,
                'cap' => 10000,
                'last_update' => now()
            ]);
        }
    }

    /**
     * Handle the Base "updated" event.
     */
    public function updated(Base $base): void
    {
        //
    }

    /**
     * Handle the Base "deleted" event.
     */
    public function deleted(Base $base): void
    {
        //
    }

    /**
     * Handle the Base "restored" event.
     */
    public function restored(Base $base): void
    {
        //
    }

    /**
     * Handle the Base "force deleted" event.
     */
    public function forceDeleted(Base $base): void
    {
        //
    }
}
