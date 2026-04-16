<?php

namespace App\Application;

use App\Models\Base;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Services\GameService;
use Illuminate\Support\Facades\DB;

/**
 * Operação: Iniciar Recrutamento de Tropas.
 * Fase 3: Harden Backend (Transacional e Lean).
 */
class TrainUnits
{
    private GameService $gameService;

    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }

    /**
     * @param Authenticatable $user
     */
    public function execute(Authenticatable $user, int $baseId, string $unit, int $quantity): void
    {
        $base = Base::findOrFail($baseId);

        // Validação de Ownership
        if ($base->jogador_id !== $user->getAuthIdentifier()) {
            throw new \Exception("Acesso Negado: A base especificada não está sob o seu comando.");
        }

        DB::transaction(function() use ($base, $unit, $quantity) {
            $this->gameService->iniciarTreino($base, $unit, $quantity);
        });
    }
}
