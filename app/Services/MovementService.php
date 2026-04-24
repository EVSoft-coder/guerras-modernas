<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Movement;
use App\Models\MovementUnit;
use App\Models\Unit;
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
            // Sincronizar recursos antes de qualquer validação tática
            app(ResourceService::class)->syncResources($origin);

            // 1. Validar ownership base origem (Simplificado: assumimos que o caller validou Auth)
            
            // 2. Validar e Calcular Velocidade do Grupo
            $minSpeed = 999999;
            $unitTypes = UnitType::whereIn('id', array_keys($units))->get();

            foreach ($unitTypes as $unitType) {
                $qty = $units[$unitType->id];
                
                // Verificar disponibilidade na base (via units table)
                $current = Unit::where('base_id', $origin->id)
                    ->where('unit_type_id', $unitType->id)
                    ->lockForUpdate()
                    ->first();

                if (!$current || $current->quantity < $qty) {
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

                // Remover da base (units table)
                Unit::where('base_id', $origin->id)
                    ->where('unit_type_id', $typeId)
                    ->decrement('quantity', $qty);
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
            
            // PASSO 7 - ARRIVAL RETURN: Adicionar Loot à base (Fase 11)
            if ($movement->type === 'return') {
                $this->transferLootToBase($movement, $base);
            }
        }

        if ($movement->type === 'attack') {
            $this->handleCombat($movement, $base);
        }

        // Marcar como processado (ATÓMICO)
        $movement->status = 'arrived';
        $movement->processed_at = now();
        $movement->save();

        Log::channel('game')->info("[MOVEMENT] Operação #{$movement->id} ({$movement->type}) concluída no setor {$base->id}");
    }

    /**
     * Gere o combate entre atacante e defensor (Fase 9.1 - Harden + Fase 11 - Loot).
     */
    private function handleCombat(Movement $movement, Base $base): void
    {
        // PASSO 2 — LOCK ORDER: Ordenar IDs para evitar Deadlocks (Fase Harden 2)
        $id1 = (int) $movement->origin_id;
        $id2 = (int) $base->id;
        
        $orderedIds = [$id1, $id2];
        sort($orderedIds);
        
        $lockedBases = [];
        foreach ($orderedIds as $id) {
            $lockedBases[$id] = Base::where('id', $id)->lockForUpdate()->first();
        }

        $originBase = $lockedBases[$id1];
        $targetBase = $lockedBases[$id2];
        
        if (!$originBase || !$targetBase) return;

        // Sincronizar recursos do defensor antes do combate/loot (Mutação Económica)
        app(ResourceService::class)->syncResources($targetBase);

        // 1. Unidades Atacantes
        $atkUnits = $movement->units->map(fn($u) => [
            'id' => $u->unit_type_id,
            'name' => $u->type->name,
            'attack' => $u->type->attack,
            'defense' => $u->type->defense,
            'carry_capacity' => $u->type->carry_capacity,
            'quantity' => $u->quantity
        ])->toArray();

        // 2. Unidades Defensoras (via units table)
        $defUnits = Unit::where('base_id', $targetBase->id)->with('type')->get()->map(function($u) {
            return [
                'id' => $u->unit_type_id,
                'name' => $u->type->name,
                'attack' => $u->type->attack,
                'defense' => $u->type->defense,
                'quantity' => $u->quantity
            ];
        })->filter(fn($u) => $u['quantity'] > 0)->toArray();

        // 3. EXECUTAR COMBATE (com bónus de pesquisa e muralha)
        $attackerPlayer = $originBase->jogador;
        $defenderPlayer = $targetBase->jogador;
        $result = $this->combatService->resolveBattle($atkUnits, $defUnits, $attackerPlayer, $defenderPlayer, $targetBase);

        // Atualizar tropas defensoras (via units table)
        foreach ($result['defender_units'] as $unit) {
            Unit::where('base_id', $targetBase->id)
                ->where('unit_type_id', $unit['id'])
                ->update(['quantity' => max(0, (int)$unit['quantity'])]);
        }

        $loot = [];
        if ($result['attacker_won']) {
            // 4. APLICAR LOOT
            $loot = $this->calculateLoot($result['attacker_units'], $targetBase);
            
            // 5. EXECUTAR CONQUEST (Se político presente)
            $this->handlePoliticalAction($movement, $targetBase, $result['attacker_units']);
        }

        // 6. Tratar Sobreviventes
        $survivors = collect($result['attacker_units'])->filter(fn($u) => $u['quantity'] > 0);
        if ($survivors->isNotEmpty()) {
            $this->createReturnMovement($movement, $targetBase, $originBase, $survivors, $loot);
        }

        // 7. Relatório (Persistência em BD)
        \App\Models\Relatorio::create([
            'atacante_id' => $originBase->jogador_id,
            'defensor_id' => $targetBase->jogador_id,
            'vencedor_id' => $result['attacker_won'] ? $originBase->jogador_id : $targetBase->jogador_id,
            'titulo' => "Batalha em " . $targetBase->nome,
            'origem_nome' => $originBase->nome,
            'destino_nome' => $targetBase->nome,
            'detalhes' => array_merge($result, ['loot' => $loot])
        ]);

        Log::channel('game')->info("[GAME_ENGINE] COMBAT_RESULT {$targetBase->id}", [
            'attacker_id' => $originBase->id,
            'attacker_won' => $result['attacker_won'],
            'loot' => $loot
        ]);
    }

    /**
     * Cancela um movimento em trânsito e inicia o regresso automático.
     * PASSO 4 — MOVEMENT CANCEL (Harden 3)
     */
    public function cancelMovement(int $movementId): Movement
    {
        return DB::transaction(function() use ($movementId) {
            $movement = Movement::where('id', $movementId)
                ->where('status', 'moving')
                ->lockForUpdate()
                ->firstOrFail();

            $now = GameClock::now();
            $departure = $movement->departure_time;
            
            // Calcular tempo já percorrido
            $elapsed = $now->diffInSeconds($departure);
            $returnArrival = $now->copy()->addSeconds($elapsed);

            // Criar Movimento de Regresso
            $returnMovement = Movement::create([
                'origin_id' => $movement->target_id,
                'target_id' => $movement->origin_id,
                'status' => 'moving',
                'type' => 'return',
                'departure_time' => $now,
                'arrival_time' => $returnArrival,
                'loot_suprimentos' => $movement->loot_suprimentos,
                'loot_combustivel' => $movement->loot_combustivel,
                'loot_municoes'    => $movement->loot_municoes
            ]);

            foreach ($movement->units as $mUnit) {
                MovementUnit::create([
                    'movement_id' => $returnMovement->id,
                    'unit_type_id' => $mUnit->unit_type_id,
                    'quantity' => $mUnit->quantity
                ]);
            }

            // Anular o original (Atómico)
            $movement->status = 'cancelled';
            $movement->processed_at = $now;
            $movement->save();

            Log::channel('game')->info("[MOVEMENT_CANCELLED] Operação #{$movementId} abortada. Regresso previsto para {$returnArrival}");

            return $returnMovement;
        }, 5);
    }

    /**
     * Resolve ações de conquista política baseadas na presença de unidades especiais (Fase 13).
     */
    private function handlePoliticalAction(Movement $movement, Base $targetBase, array $attackerUnits): void
    {
        // PASSO 4 - DETEÇÃO POLÍTICO
        $politicoCount = 0;
        foreach ($attackerUnits as $unit) {
            if (isset($unit['name']) && strtolower($unit['name']) === 'politico') {
                $politicoCount += (int) $unit['quantity'];
            }
        }

        if ($politicoCount <= 0) return;

        // PASSO 5 - REDUÇÃO DE LEALDADE (Tribal)
        $loyaltyService = app(LoyaltyService::class);
        $reduction = rand(20, 35) * $politicoCount;
        $newLoyalty = $loyaltyService->reduceLoyalty($targetBase, $reduction);
        
        Log::channel('game')->warning("[CONQUEST] Lealdade reduzida no setor {$targetBase->id} para {$newLoyalty}% (-{$reduction})");

        // PASSO 6 - CONQUISTA
        if ($newLoyalty <= 0) {
            $this->executeConquest($movement, $targetBase);
        }
    }

    /**
     * Executa a transferência de posse da base (Fase 13 - Passo 5).
     */
    private function executeConquest(Movement $movement, Base $targetBase): void
    {
        // PASSO 7 - PROTEGER OWNER (Garantir que a mudança é feita apenas se a lealdade for 0)
        if ($targetBase->loyalty > 0) return;

        $newOwnerId = $movement->origin->jogador_id;
        $oldOwnerId = $targetBase->jogador_id;

        // PASSO 3 — CONQUEST CLEANUP COMPLETO (Harden 2)
        $targetBase->jogador_id = $newOwnerId;
        $targetBase->loyalty = rand(25, 35);
        $targetBase->nome = "Província de " . ($movement->origin->jogador->username ?? "Jogador {$newOwnerId}");
        $targetBase->save();

        DB::table('building_queue')->where('base_id', $targetBase->id)->delete();
        DB::table('unit_queue')->where('base_id', $targetBase->id)->delete();
        DB::table('tropas')->where('base_id', $targetBase->id)->delete();
        
        // Anular movimentos 
        DB::table('movements')->where('target_id', $targetBase->id)->where('status', 'moving')->update(['status' => 'cancelled', 'processed_at' => now()]);
        DB::table('movements')->where('origin_id', $targetBase->id)->where('status', 'moving')->update(['status' => 'cancelled', 'processed_at' => now()]);

        Log::channel('game')->emergency("[CONQUEST] SETOR {$targetBase->id} CAPTURADO por {$newOwnerId} (Antigo: {$oldOwnerId}). Limpeza total executada.");
    }

    /**
     * Calcula o saque baseado na capacidade das unidades (Fase 11 + 12 Harden).
     */
    private function calculateLoot(array $attackerUnits, Base $targetBase): array
    {
        $totalCapacity = 0;
        foreach ($attackerUnits as $unit) {
            $totalCapacity += ($unit['carry_capacity'] ?? 10) * $unit['quantity'];
        }

        $resources = $targetBase->recursos;
        if (!$resources || $totalCapacity <= 0) return [];

        $loot = [];
        $types = ['suprimentos', 'combustivel', 'municoes', 'metal', 'energia'];
        
        // Calcular Total de Recursos Disponíveis (para distribuição proporcional - Passo 4)
        $totalAvailable = 0;
        foreach ($types as $type) $totalAvailable += max(0, $resources->{$type});

        if ($totalAvailable <= 0) return [];

        // Sincronização final pré-débito (Garantir que o loot é real)
        app(ResourceService::class)->syncResources($targetBase);
        $resources = $targetBase->recursos; // Recarregar após sync
        $actualLootTotal = min($totalCapacity, $totalAvailable * 0.5); // Saqueamos no máximo 50%

        foreach ($types as $type) {
            $available = max(0, $resources->{$type});
            $ratio = $available / $totalAvailable;
            $stolen = min($available, $actualLootTotal * $ratio);
            
            $loot["loot_{$type}"] = (float) $stolen;
            
            // Deduzir da base alvo
            if ($stolen > 0) {
                $resources->decrement($type, $stolen);
                Log::channel('game')->info("[LOOT] Recursos extraídos do setor {$targetBase->id}: {$stolen} de {$type}");
            }
        }

        return $loot;
    }

    /**
     * Cria o movimento de regresso das tropas (Fase 10 + 11 Loot).
     */
    private function createReturnMovement(Movement $originalMovement, Base $currentBase, Base $homeBase, $survivors, array $loot = []): void
    {
        $travelTimeSeconds = (int) $originalMovement->departure_time->diffInSeconds($originalMovement->arrival_time);
        $arrival = now()->addSeconds($travelTimeSeconds);

        $data = array_merge([
            'origin_id' => $currentBase->id,
            'target_id' => $homeBase->id,
            'departure_time' => now(),
            'arrival_time' => $arrival,
            'status' => 'moving',
            'type' => 'return'
        ], $loot);

        $returnMovement = Movement::create($data);

        foreach ($survivors as $unit) {
            MovementUnit::create([
                'movement_id' => $returnMovement->id,
                'unit_type_id' => $unit['id'],
                'quantity' => $unit['quantity']
            ]);
        }
    }

    /**
     * Transfere o loot do movimento para os recursos da base (Fase 12 Harden).
     */
    private function transferLootToBase(Movement $movement, Base $base): void
    {
        // Sincronizar antes de adicionar para não perder produção offline (Mutação Económica)
        app(ResourceService::class)->syncResources($base);
        
        $resources = $base->recursos;
        if (!$resources) return;

        $types = ['suprimentos', 'combustivel', 'municoes', 'metal', 'energia'];
        $capacity = (int) ($resources->storage_capacity ?? 10000); // Passo 6

        foreach ($types as $type) {
            $amount = (float) $movement->{"loot_{$type}"};
            if ($amount > 0) {
                $current = $resources->{$type};
                $canReceive = max(0, $capacity - $current);
                $toAdd = min($amount, $canReceive);
                
                $resources->increment($type, $toAdd);
            }
        }

        Log::channel('game')->info("[LOOT_APPLIED] Saque entregue na base {$base->id}", [
            'movement_id' => $movement->id,
            'loot' => $movement->only(['loot_suprimentos', 'loot_combustivel', 'loot_municoes'])
        ]);
    }

    /**
     * Transfere as unidades do movimento para a guarnição da base destino.
     */
    private function transferUnitsToGarrison(Movement $movement, Base $base): void
    {
        foreach ($movement->units as $mUnit) {
            // Adicionar à base destino (via units table)
            Unit::updateOrCreate(
                ['base_id' => $base->id, 'unit_type_id' => $mUnit->unit_type_id],
                ['quantity' => DB::raw("quantity + {$mUnit->quantity}")]
            );
        }
    }
}
