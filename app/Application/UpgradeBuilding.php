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
        DB::transaction(function() use ($user, $baseId, $type, $posX, $posY) {
            // 1. Lock Global da Base (Fase Crítica - Passo 3)
            $base = Base::where('id', $baseId)->lockForUpdate()->firstOrFail();

            // 2. Validação via Gate (Fase Crítica - Passo 5)
            if (\Illuminate\Support\Facades\Gate::forUser($user)->denies('update', $base)) {
                throw new \Exception("Acesso Negado: A base especificada não está sob o seu comando.");
            }

            $this->gameService->iniciarUpgrade($base, $type, $posX, $posY);
        });
    }
}
