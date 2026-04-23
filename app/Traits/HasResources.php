<?php

namespace App\Traits;

use App\Services\GameService;
use App\Models\Recurso;

trait HasResources
{
    /**
     * Atualiza os recursos da base em tempo real.
     */
    public function updateResources()
    {
        \App\Services\GameEngine::process($this);
        return $this->recursos;
    }

    /**
     * Relação com os recursos da base.
     */
    public function recursos()
    {
        return $this->hasOne(Recurso::class);
    }
}
