<?php

namespace App\Application;

use App\Models\Ataque;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\DB;

/**
 * Operação: Cancelar Missão Militar.
 * Fase 3: Harden Backend.
 */
class CancelMission
{
    /**
     * @param Authenticatable $user
     */
    public function execute(Authenticatable $user, int $attackId): void
    {
        $ataque = Ataque::with('origem')->findOrFail($attackId);
        
        // Ownership Check
        if ($ataque->origem->jogador_id !== $user->getAuthIdentifier()) {
            throw new \Exception("Acesso Negado: Você não tem autoridade para abortar esta missão.");
        }

        if ($ataque->processado) {
            throw new \Exception("ERRO TÁTICO: A missão já atingiu o alvo e não pode ser abortada.");
        }

        DB::transaction(function() use ($ataque) {
            $baseOrigem = $ataque->origem;
            
            // Reembolso de tropas
            foreach ($ataque->tropas as $unidade => $quantidade) {
                // Lock for update para evitar race conditions no reembolso
                $baseOrigem->tropas()->where('unidade', $unidade)->increment('quantidade', $quantidade);
            }
            
            $ataque->delete();
        });
    }
}
