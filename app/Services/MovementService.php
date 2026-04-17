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
    private CombatService $combatService;

    public function __construct(MapService $mapService, ?CombatService $combatService = null)
    {
        $this->mapService = $mapService;
        $this->combatService = $combatService ?? new CombatService();
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
        // 1. Selecionamos IDs candidatos (sem lock ainda para não prender a query global)
        $candidateIds = Movement::where('target_id', $base->id)
            ->where('status', 'moving')
            ->where('arrival_time', '<=', now())
            ->whereNull('processed_at')
            ->pluck('id');

        foreach ($candidateIds as $id) {
            DB::transaction(function() use ($id, $base) {
                // LOCK MOVEMENT (PASSO 1)
                $lockedMovement = Movement::where('id', $id)
                    ->lockForUpdate()
                    ->first();

                if (!$lockedMovement || $lockedMovement->processed_at) return;

                // LOCK UNITS (PASSO 3)
                $lockedMovement->load(['units' => function($q) {
                    $q->lockForUpdate();
                }]);

                // APLICAR CHEGADA (PASSO 4)
                $this->applyArrival($lockedMovement, $base);
            });
        }
    }

    /**
     * Aplica o efeito da chegada de um movimento (Passo 4).
     */
    private function applyArrival(Movement $movement, Base $base): void
    {
        // PASSO 4 - APLICAR EFEITOS
        if ($movement->type === 'support' || $movement->type === 'return') {
            $this->transferUnitsToGarrison($movement, $base);
        }

        if ($movement->type === 'attack') {
            $this->handleCombat($movement, $base);
        }

        // Marcar como processado
        $movement->update([
            'status' => 'arrived',
            'processed_at' => now()
        ]);

        Log::channel('game')->info("[MOVEMENT_FINAL_HARDEN] Movimento {$movement->id} ({$movement->type}) processado.");
    }

    /**
     * Gere o combate entre atacante e defensor (Fase 9.1 - Harden).
     */
    private function handleCombat(Movement $movement, Base $base): void
    {
        DB::transaction(function() use ($movement, $base) {
            // LOCKS AGRESSIVOS (PASSO 2)
            $originBase = Base::where('id', $movement->origin_id)->lockForUpdate()->first();
            $targetBase = Base::where('id', $base->id)->lockForUpdate()->first();
            
            // 1. Mapear Atacantes
            $atkUnits = $movement->units->map(fn($u) => [
                'id' => $u->unit_type_id,
                'name' => $u->type->name,
                'attack' => $u->type->attack,
                'defense' => $u->type->defense,
                'quantity' => $u->quantity
            ])->toArray();

            // 2. Mapear Defensores
            $defUnits = Tropas::where('base_id', $targetBase->id)->get()->map(function($t) {
                $type = UnitType::where('name', $t->unidade)->first();
                return [
                    'id' => $type?->id,
                    'name' => $t->unidade,
                    'attack' => $type?->attack ?? 0,
                    'defense' => $type?->defense ?? 0,
                    'quantity' => $t->quantidade
                ];
            })->filter(fn($u) => $u['quantity'] > 0)->toArray();

            // 3. Resolver Batalha
            $result = $this->combatService->resolveBattle($atkUnits, $defUnits);

            // 4. Aplicar Perdas no Defensor (Atomic - Passo 5)
            foreach ($result['defender_units'] as $unit) {
                Tropas::where('base_id', $targetBase->id)
                    ->where('unidade', $unit['name'])
                    ->update(['quantidade' => max(0, (int)$unit['quantity'])]); // PASSO 3 - SEM NEGATIVOS
            }

            // 5. Atualizar unidades sobreviventes no movimento
            foreach ($result['attacker_units'] as $unit) {
                MovementUnit::where('movement_id', $movement->id)
                    ->where('unit_type_id', $unit['id'])
                    ->update(['quantity' => max(0, (int)$unit['quantity'])]);
            }

            // 6. Gerar Relatório
            \App\Models\Relatorio::create([
                'atacante_id' => $originBase->jogador_id,
                'defensor_id' => $targetBase->jogador_id,
                'vencedor_id' => $result['attacker_won'] ? $originBase->jogador_id : $targetBase->jogador_id,
                'titulo' => "COMBAT_RESULT: " . $targetBase->nome,
                'origem_nome' => $originBase->nome,
                'destino_nome' => $targetBase->nome,
                'detalhes' => $result
            ]);

            Log::channel('game')->info("[COMBAT_RESULT] Resolvido entre Base {$originBase->id} e {$targetBase->id}", $result['stats']);
        });
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
