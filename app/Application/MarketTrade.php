<?php

namespace App\Application;

use App\Models\Base;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Services\GameService;
use Illuminate\Support\Facades\DB;

/**
 * Operação: Troca no Mercado Negro.
 * Fase 3: Harden Backend.
 */
class MarketTrade
{
    private GameService $gameService;

    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }

    /**
     * @param Authenticatable $user
     */
    public function execute(Authenticatable $user, int $baseId, string $offer, string $receive): void
    {
        $base = Base::findOrFail($baseId);

        // Validação de Ownership
        if ($base->jogador_id !== $user->getAuthIdentifier()) {
            throw new \Exception("Acesso Negado: A base especificada não está sob o seu comando.");
        }

        DB::transaction(function() use ($base, $offer, $receive) {
            // Sincronizar antes de qualquer transação
            $this->gameService->syncResources($base);

            $custo = 300;
            $ganho = 100;
            
            if (!$this->gameService->consumirRecursos($base, [$offer => $custo])) {
                throw new \Exception("Logística de mercado insuficiente para a troca.");
            }

            if ($base->recursos) {
                $base->recursos->increment($receive, $ganho);
            }
        });
    }
}
