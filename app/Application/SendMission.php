<?php

namespace App\Application;

use App\Models\Base;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Services\CombatService;
use App\Services\TimeService;
use App\Services\MovementService;
use Illuminate\Support\Facades\DB;

/**
 * Operação: Enviar Missão Militar.
 * Valida ownership, cooldowns e proteção do alvo.
 */
class SendMission
{
    private MovementService $movementService;
    private TimeService $timeService;

    public function __construct(MovementService $movementService, TimeService $timeService)
    {
        $this->movementService = $movementService;
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
            
            // 2. Validação via Gate (Fase Crítica - Passo 5)
            if (\Illuminate\Support\Facades\Gate::forUser($user)->denies('command', $baseOrigem)) {
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

            if ($baseDestino) {
                $this->movementService->sendTroops($baseOrigem, $baseDestino, $data['tropas'], $data['tipo']);
            } else {
                // TODO: Implementar ataque a coordenadas se necessário (implementação atual foca em bases)
                throw new \Exception("COORDENADAS: O comando central ainda não autorizou ataques a setores sem estruturas detetadas.");
            }
        });
    }
}
