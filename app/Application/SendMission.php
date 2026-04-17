<?php

namespace App\Application;

use App\Models\Base;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Services\CombatService;
use App\Services\TimeService;
use Illuminate\Support\Facades\DB;

/**
 * Operação: Enviar Missão Militar.
 * Valida ownership, cooldowns e proteção do alvo.
 */
class SendMission
{
    private CombatService $combatService;
    private TimeService $timeService;

    public function __construct(CombatService $combatService, TimeService $timeService)
    {
        $this->combatService = $combatService;
        $this->timeService = $timeService;
    }

    /**
     * @param Authenticatable $user
     */
    public function execute(Authenticatable $user, array $data): void
    {
        DB::transaction(function() use ($user, $data) {
            // 1. Lock Global da Base de Origem (Fase Crítica - Passo 3)
            $baseOrigem = Base::where('id', $data['origem_id'])->lockForUpdate()->firstOrFail();
            
            // 2. Validação via Policy (Fase Crítica - Passo 5)
            if ($user->cannot('command', $baseOrigem)) {
                throw new \Exception("Acesso Negado: Você não tem autoridade sobre esta unidade de comando.");
            }

            $baseDestino = null;
            $coords = null;

            if (empty($data['destino_id'])) {
                $coords = ['x' => $data['destino_x'], 'y' => $data['destino_y']];
            } else {
                $baseDestino = Base::findOrFail($data['destino_id']);
                
                // Validação de Proteção
                if ($baseDestino->is_protected && $baseDestino->protection_until && $this->timeService->now()->lt($baseDestino->protection_until)) {
                    throw new \Exception("ALVO SOB PROTEÇÃO: O setor está em trégua diplomática.");
                }
            }

            $this->combatService->iniciarAtaque($baseOrigem, $baseDestino, $data['tropas'], $data['tipo'], $coords);
        });
    }
}
