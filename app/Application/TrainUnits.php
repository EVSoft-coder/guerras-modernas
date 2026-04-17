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
    public function execute(Authenticatable $user, int $baseId, string|int $unitOrId, int $quantity): void
    {
        DB::transaction(function() use ($user, $baseId, $unitOrId, $quantity) {
            // 1. Lock Global da Base (Fase Crítica - Passo 3)
            $base = Base::where('id', $baseId)->lockForUpdate()->firstOrFail();

            // 2. Validação via Policy (Fase Crítica - Passo 5)
            if ($user->cannot('update', $base)) {
                throw new \Exception("Acesso Negado: A base especificada não está sob o seu comando.");
            }

            // Se for ID numérico, carregar UnitType correspondente
            if (is_numeric($unitOrId)) {
                $this->gameService->iniciarTreino($base, (int)$unitOrId, $quantity);
            } else {
                // Caso legado: Procurar UnitType pelo nome aproximado (Harden Legacy)
                $unitType = \App\Models\UnitType::where('name', 'like', "%{$unitOrId}%")->first();
                if (!$unitType) {
                    throw new \Exception("LOGÍSTICA: Unidade '{$unitOrId}' não reconhecida pelo comando central.");
                }
                $this->gameService->iniciarTreino($base, $unitType->id, $quantity);
            }
        });
    }
}
