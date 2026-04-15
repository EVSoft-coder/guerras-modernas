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
        $service->syncResources($this);
        
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

    public function getMetalRateAttribute()
    {
        return $this->getProductionRates()['metal'] / 60;
    }

    public function getEnergiaRateAttribute()
    {
        return $this->getProductionRates()['energia'] / 60;
    }

    public function getComidaRateAttribute()
    {
        return $this->getProductionRates()['comida'] / 60;
    }
}
