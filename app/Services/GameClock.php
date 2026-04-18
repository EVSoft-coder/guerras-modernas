<?php

namespace App\Services;

use Illuminate\Support\Carbon;

/**
 * GameClock - O Relógio Soberano do Sistema (PASSO 5 — GAME CLOCK).
 * Garante que todo o motor utiliza a mesma referência temporal precisa.
 */
class GameClock
{
    /**
     * Retorna o momento atual do jogo.
     */
    public static function now(): Carbon
    {
        return Carbon::now();
    }

    /**
     * Retorna o timestamp para persistência.
     */
    public static function timestamp(): string
    {
        return self::now()->toDateTimeString();
    }
}
