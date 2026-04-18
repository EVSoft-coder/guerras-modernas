<?php

namespace App\Application;

use App\Models\Movement;
use App\Services\MovementService;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\DB;

/**
 * Operação: Cancelar Missão Militar (FASE HARDEN 3).
 * Implementa o Regresso Automático via MovementService.
 */
class CancelMission
{
    private MovementService $movementService;

    public function __construct(MovementService $movementService)
    {
        $this->movementService = $movementService;
    }

    /**
     * @param Authenticatable $user
     */
    public function execute(Authenticatable $user, int $movementId): void
    {
        DB::transaction(function() use ($user, $movementId) {
            // 1. Lock e Validação (Lock for update é feito dentro do MovementService)
            $movement = Movement::findOrFail($movementId);
            
            // Ownership Check via Base de Origem (do ponto de vista do atacante)
            if ($movement->origin->jogador_id !== $user->getAuthIdentifier()) {
                throw new \Exception("Acesso Negado: Você não tem autoridade para abortar esta operação.");
            }

            if ($movement->status !== 'moving') {
                throw new \Exception("ERRO TÁTICO: A missão não pode ser abortada no estado atual.");
            }

            // 2. Executar Regresso Automático (PASSO 4 — Harden 3)
            $this->movementService->cancelMovement($movementId);
        }, 5);
    }
}
