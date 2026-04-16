<?php

namespace App\Services;

use Illuminate\Support\Carbon;

/**
 * TimeService - Oráculo Temporal do Projeto.
 * Centraliza a gestão de tempo para garantir determinismo e facilitar testes.
 */
class TimeService
{
    /**
     * Retorna o momento atual.
     */
    public function now(): Carbon
    {
        return Carbon::now();
    }
}
