<?php

namespace App\Application;

use App\Models\Base;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Services\GameService;
use Illuminate\Support\Facades\DB;

/**
 * Operação: Iniciar Upgrade de Edifício.
 * Valida ownership e delega ao GameService.
 */
class UpgradeBuilding
{
    private GameService $gameService;

    public function __construct(GameService $gameService)
    {
        $this->gameService = $gameService;
    }

    /**
     * @param Authenticatable $user
     */
    public function execute(Authenticatable $user, int $baseId, string $type, int $posX = 0, int $posY = 0): void
    {
        $base = Base::findOrFail($baseId);

        // Validação de Ownership via getAuthIdentifier()
        if ($base->jogador_id !== $user->getAuthIdentifier()) {
            throw new \Exception("Acesso Negado: A base especificada não está sob o seu comando.");
        }

        DB::transaction(function() use ($base, $type, $posX, $posY) {
            $this->gameService->iniciarUpgrade($base, $type, $posX, $posY);
        });
    }
}
