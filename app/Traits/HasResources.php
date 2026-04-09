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
        $service = new GameService();
        $service->atualizarRecursos($this);
        
        return $this->recursos;
    }

    /**
     * Obtém as taxas de produção atuais (por minuto).
     */
    public function getProductionRates()
    {
        $service = new GameService();
        return $service->obterTaxasProducao($this);
    }

    /**
     * Relação com os recursos da base.
     */
    public function recursos()
    {
        return $this->hasOne(Recurso::class);
    }
}
