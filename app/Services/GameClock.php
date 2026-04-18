<?php

namespace App\Services;

use Illuminate\Support\Carbon;

/**
 * GameClock - Referência Temporal Imutável (PASSO 2 — FASE HARDEN 3).
 * Fixa o tempo no primeiro acesso do request para garantir consistência atómica.
 */
class GameClock
{
    private static ?Carbon $requestTime = null;

    /**
     * Retorna o momento do jogo, imutável durante o ciclo de vida do request.
     */
    public static function now(): Carbon
    {
        if (self::$requestTime === null) {
            self::$requestTime = Carbon::now();
        }
        return self::$requestTime->copy();
    }

    /**
     * Reinicia o relógio (Útil para testes ou filas longas de processamento em loop).
     */
    public static function reset(): void
    {
        self::$requestTime = Carbon::now();
    }

    public static function timestamp(): string
    {
        return self::now()->toDateTimeString();
    }
}
