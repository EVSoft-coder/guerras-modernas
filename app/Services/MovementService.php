<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Movement;
use App\Models\MovementUnit;
use App\Models\Tropas;
use App\Models\UnitType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * MovementService - Cadeia de Comando Logística.
 * Gere o trânsito de tropas entre bases com tempo de viagem real.
 */
class MovementService
{
    private MapService $mapService;

    public function __construct(MapService $mapService)
    {
        $this->mapService = $mapService;
    }

    /**
     * Inicia um movimento militar entre bases (Passo 3).
     */
    public function sendTroops(Base $origin, Base $target, array $units, string $type = 'attack'): Movement
    {
        return DB::transaction(function() use ($origin, $target, $units, $type) {
            // 1. Validar ownership base origem (Simplificado: assumimos que o caller validou Auth)
            
            // 2. Validar e Calcular Velocidade do Grupo
            $minSpeed = 999999;
            $unitTypes = UnitType::whereIn('id', array_keys($units))->get();

            foreach ($unitTypes as $unitType) {
                $qty = $units[$unitType->id];
                
                // Verificar disponibilidade na base
                $current = Tropas::where('base_id', $origin->id)
                    ->where('unidade', $unitType->name) // O model Tropas usa 'unidade' como string name
                    ->lockForUpdate()
                    ->first();

                if (!$current || $current->quantidade < $qty) {
                    throw new \Exception("LOGÍSTICA: Unidades Insuficientes de " . $unitType->name);
                }

                // Velocidade do grupo é a da unidade mais lenta
                if ($unitType->speed < $minSpeed) {
                    $minSpeed = (float) $unitType->speed;
                }
            }

            if ($minSpeed === 999999) $minSpeed = config('game.movement.base_speed', 1.0);

            // 3. Calcular Tempo de Viagem (Passo 4 - MapService)
            $travelTimeSeconds = $this->mapService->calculateTravelTime($origin, $target, $minSpeed);
            
            $departure = now();
            $arrival = $departure->copy()->addSeconds($travelTimeSeconds);

            // 4. Criar Movement (Passo 1 - Status: moving)
            $movement = Movement::create([
                'origin_id' => $origin->id,
                'target_id' => $target->id,
                'departure_time' => $departure,
                'arrival_time' => $arrival,
                'status' => 'moving',
                'type' => $type
            ]);

            // 5. Inserir movement_units e Remover da Origem (Passo 3.6 / 3.7)
            foreach ($units as $typeId => $qty) {
                MovementUnit::create([
                    'movement_id' => $movement->id,
                    'unit_type_id' => $typeId,
                    'quantity' => $qty
                ]);

                // Remover da base
                $unitName = $unitTypes->find($typeId)->name;
                Tropas::where('base_id', $origin->id)
                    ->where('unidade', $unitName)
                    ->decrement('quantidade', $qty);
            }

            Log::channel('game')->info("[MOVEMENT_STARTED] Base {$origin->id} -> Base {$target->id}", [
                'id' => $movement->id,
                'arrival' => $arrival->toDateTimeString()
            ]);

            return $movement;
        });
    }

    /**
     * Processa movimentos que chegaram ao destino (Passo 4 - Harden).
     */
    public function processMovements(Base $base): void
    {
        // 1. Movimentos que têm esta base como destino e já deviam ter chegado
        $movements = Movement::where('target_id', $base->id)
            ->where('status', 'moving')
            ->where('arrival_time', '<=', now())
            ->whereNull('processed_at') // PASSO 3 - IDPOTÊNCIA
            ->get();

        foreach ($movements as $movement) {
            DB::transaction(function() use ($movement, $base) {
                // LOCK SEGURO (PASSO 1)
                $lockedMovement = Movement::where('id', $movement->id)
                    ->lockForUpdate()
                    ->first();

                if (!$lockedMovement || $lockedMovement->processed_at) return;

                // PASSO 4 - APLICAR EFEITO (TRANSFERIR UNIDADES EM CASO DE SUPORTE)
                if ($lockedMovement->type === 'support') {
                    $this->transferUnitsToGarrison($lockedMovement, $base);
                }

                // Se for ataque, apenas marcamos como chegado. O combate será resolvido na Fase 9.
                $lockedMovement->update([
                    'status' => 'arrived',
                    'processed_at' => now()
                ]);

                Log::channel('game')->info("[MOVEMENT_PROCESSED] Movimento {$movement->id} chegou e foi processado na base {$base->id}.");
            });
        }
    }

    /**
     * Transfere as unidades do movimento para a guarnição da base destino.
     */
    private function transferUnitsToGarrison(Movement $movement, Base $base): void
    {
        foreach ($movement->units as $mUnit) {
            $unitName = $mUnit->type->name;
            
            // Adicionar à base destino
            Tropas::updateOrCreate(
                ['base_id' => $base->id, 'unidade' => $unitName],
                ['quantidade' => DB::raw("quantidade + {$mUnit->quantity}")]
            );
        }
    }
}
