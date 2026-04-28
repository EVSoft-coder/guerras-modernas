<?php

namespace App\Services;

use App\Models\Jogador;
use App\Models\BuildingQueue;
use App\Models\UnitQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * PremiumService - Motor de Monetização (FASE 2).
 * Gere Pontos Premium, Redução de Tempos e Conta Premium.
 */
class PremiumService
{
    const COST_REDUCE_TIME = 30;
    const COST_PREMIUM_ACCOUNT_30_DAYS = 200;

    /**
     * Reduz o tempo de uma obra em 50% do tempo restante.
     */
    public function reduceBuildingTime(Jogador $jogador, int $queueId)
    {
        return DB::transaction(function() use ($jogador, $queueId) {
            $item = BuildingQueue::where('id', $queueId)
                ->whereHas('base', function($q) use ($jogador) {
                    $q->where('jogador_id', $jogador->id);
                })
                ->lockForUpdate()
                ->first();

            if (!$item) throw new \Exception("ENGENHARIA: Obra não encontrada.");
            
            if ($jogador->pontos_premium < self::COST_REDUCE_TIME) {
                throw new \Exception("ECONOMIA: Pontos premium insuficientes (Necessita: " . self::COST_REDUCE_TIME . ").");
            }

            $now = GameClock::now();
            $remaining = $now->diffInSeconds($item->finishes_at, false);

            if ($remaining <= 5) {
                throw new \Exception("ENGENHARIA: A obra já está quase concluída.");
            }

            // Reduzir o tempo restante em 50%
            $newRemaining = floor($remaining / 2);
            $item->finishes_at = $now->copy()->addSeconds($newRemaining);
            
            // Recalcular a duração total (do início até o novo fim) para manter consistência
            $item->duration = $item->started_at->diffInSeconds($item->finishes_at);
            $item->save();

            $jogador->decrement('pontos_premium', self::COST_REDUCE_TIME);

            Log::channel('game')->info("[PREMIUM] TIME_REDUCED_BUILDING {$jogador->id}", [
                'queue_id' => $queueId,
                'saved_seconds' => $remaining - $newRemaining
            ]);

            // Reorganizar a fila para os itens seguintes na mesma base
            app(BuildingQueueService::class)->refreshQueue($item->base_id, $item->finishes_at);

            return $item;
        }, 5);
    }

    /**
     * Reduz o tempo de um recrutamento em 50% do tempo restante.
     */
    public function reduceUnitTime(Jogador $jogador, int $queueId)
    {
        return DB::transaction(function() use ($jogador, $queueId) {
            $item = UnitQueue::where('id', $queueId)
                ->whereHas('base', function($q) use ($jogador) {
                    $q->where('jogador_id', $jogador->id);
                })
                ->lockForUpdate()
                ->first();

            if (!$item) throw new \Exception("LOGÍSTICA: Recrutamento não encontrado.");
            
            if ($jogador->pontos_premium < self::COST_REDUCE_TIME) {
                throw new \Exception("ECONOMIA: Pontos premium insuficientes.");
            }

            $now = GameClock::now();
            $remaining = $now->diffInSeconds($item->finishes_at, false);

            if ($remaining <= 5) {
                throw new \Exception("LOGÍSTICA: O recrutamento já está quase concluído.");
            }

            $newRemaining = floor($remaining / 2);
            $item->finishes_at = $now->copy()->addSeconds($newRemaining);
            $item->save();

            $jogador->decrement('pontos_premium', self::COST_REDUCE_TIME);

            Log::channel('game')->info("[PREMIUM] TIME_REDUCED_UNIT {$jogador->id}", [
                'queue_id' => $queueId,
                'saved_seconds' => $remaining - $newRemaining
            ]);

            app(UnitQueueService::class)->refreshQueue($item->base_id, $item->finishes_at);

            return $item;
        }, 5);
    }

    /**
     * Ativa ou prolonga a Conta Premium.
     */
    public function activatePremiumAccount(Jogador $jogador, int $days = 30)
    {
        $cost = ($days === 30) ? self::COST_PREMIUM_ACCOUNT_30_DAYS : floor(self::COST_PREMIUM_ACCOUNT_30_DAYS * ($days / 30));

        return DB::transaction(function() use ($jogador, $days, $cost) {
            if ($jogador->pontos_premium < $cost) {
                throw new \Exception("ECONOMIA: Pontos premium insuficientes.");
            }

            $start = ($jogador->premium_until && $jogador->premium_until->isFuture()) 
                ? $jogador->premium_until 
                : Carbon::now();

            $jogador->premium_until = $start->addDays($days);
            $jogador->decrement('pontos_premium', $cost);
            $jogador->save();

            Log::channel('game')->info("[PREMIUM] ACCOUNT_ACTIVATED {$jogador->id}", [
                'days' => $days,
                'until' => $jogador->premium_until
            ]);

            return $jogador;
        }, 5);
    }
}
