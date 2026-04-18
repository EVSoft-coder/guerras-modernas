<?php

namespace App\Services;

use App\Models\Base;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * LoyaltyService - Sistema de Conquista Tribal (FASE TRIBAL).
 * Gere a regeneração e redução de lealdade das bases.
 */
class LoyaltyService
{
    /**
     * Regenera a lealdade da base baseado no tempo decorrido.
     * Taxa Base: 1 ponto por hora (Estilo TribalWars).
     */
    public function updateLoyalty(Base $base): void
    {
        $now = GameClock::now();
        $lastUpdate = $base->loyalty_updated_at ? Carbon::parse($base->loyalty_updated_at) : $now;
        
        $secondsPassed = $now->diffInSeconds($lastUpdate);
        if ($secondsPassed < 3600 && $base->loyalty >= 100) {
            return;
        }

        // 1 ponto por hora = 1/3600 por segundo
        $recoveryAmount = $secondsPassed / 3600;
        
        if ($recoveryAmount > 0) {
            $newLoyalty = min(100, $base->loyalty + $recoveryAmount);
            
            if ((int)$newLoyalty !== (int)$base->loyalty) {
                $base->loyalty = (int)$newLoyalty;
                $base->loyalty_updated_at = $now;
                $base->save();
                
                Log::channel('game')->info("[LOYALTY_RECOVERY] Base #{$base->id} recuperou lealdade para {$base->loyalty}");
            }
        }
    }

    /**
     * Reduz a lealdade após um ataque de "Agente/Nobre".
     */
    public function reduceLoyalty(Base $base, int $amount): int
    {
        $oldLoyalty = $base->loyalty;
        $newLoyalty = max(0, $oldLoyalty - $amount);
        
        $base->loyalty = $newLoyalty;
        $base->loyalty_updated_at = GameClock::now();
        $base->save();
        
        return $newLoyalty;
    }
}
