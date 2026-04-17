<?php

namespace App\Observers;

use App\Models\Base;

class BaseObserver
{
    /**
     * Handle the Base "created" event.
     * Inicializa os recursos de uma nova base.
     */
    public function created(Base $base): void
    {
        // Criar registo inicial de recursos se não existir
        if (!$base->recursos) {
            $base->recursos()->create([
                'suprimentos' => 1000,
                'combustivel' => 800,
                'municoes' => 700,
                'pessoal' => 500,
                'metal' => 0,
                'energia' => 0,
                'cap' => 10000,
                'last_update' => app(\App\Services\TimeService::class)->now()
            ]);
        }
    }

    /**
     * NOTA: Removidos retrieved() e saving() que causavam recursão infinita.
     * A sincronização agora é gerida de forma explícita pela camada Application (SyncResources).
     */
}
