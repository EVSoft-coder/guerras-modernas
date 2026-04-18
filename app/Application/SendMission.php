<?php

namespace App\Application;

use App\Models\Base;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Services\CombatService;
use App\Services\TimeService;
use App\Services\MovementService;
use Illuminate\Support\Facades\DB;

/**
 * Operação: Enviar Missão Militar (FASE HARDEN 2).
 * Valida ownership, cooldowns e aplica LOCK ORDER para evitar deadlocks.
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
            $idOrigem = (int) $data['origem_id'];
            $idDestino = (int) ($data['destino_id'] ?? 0);

            // PASSO 2 — LOCK ORDER: Bloquear sempre ID menor primeiro (Evita Deadlocks)
            if ($idDestino > 0) {
                $orderedIds = [$idOrigem, $idDestino];
                sort($orderedIds);
                
                $lockedBases = [];
                foreach ($orderedIds as $id) {
                    $lockedBases[$id] = Base::where('id', $id)->lockForUpdate()->firstOrFail();
                }
                $baseOrigem = $lockedBases[$idOrigem];
                $baseDestino = $lockedBases[$idDestino];

                // Validação de Proteção
                if ($baseDestino->is_protected && $baseDestino->protection_until && $this->timeService->now()->lt($baseDestino->protection_until)) {
                    throw new \Exception("ALVO SOB PROTEÇÃO: O setor está em trégua diplomática.");
                }
            } else {
                $baseOrigem = Base::where('id', $idOrigem)->lockForUpdate()->firstOrFail();
                $baseDestino = null;
                $coords = ['x' => $data['destino_x'] ?? 0, 'y' => $data['destino_y'] ?? 0];
            }

            // 1. Validação via Gate
            if (\Illuminate\Support\Facades\Gate::forUser($user)->denies('command', $baseOrigem)) {
                throw new \Exception("Acesso Negado: Você não tem autoridade sobre esta unidade de comando.");
            }

            if ($baseDestino) {
                $this->movementService->sendTroops($baseOrigem, $baseDestino, $data['tropas'], $data['tipo']);
            } else {
                throw new \Exception("COORDENADAS: O comando militar exige identificação de estrutura alvo para mobilização.");
            }
        });
    }
}
