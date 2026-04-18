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

        Log::channel('game')->info("[MOVEMENT_PROCESSED] Movimento {$movement->id} ({$movement->type}) finalizado com sucesso.");
    }

    /**
     * Gere o combate entre atacante e defensor (Fase 9.1 - Harden + Fase 11 - Loot).
     */
    private function handleCombat(Movement $movement, Base $base): void
    {
        // PASSO 1 & 2 - LOCK COMPLETO (Transação já iniciada no processMovements)
        $originBase = Base::where('id', $movement->origin_id)->lockForUpdate()->first();
        $targetBase = Base::where('id', $base->id)->lockForUpdate()->first();
        
        if (!$originBase || !$targetBase) return;

        // 1. Unidades Atacantes
        $atkUnits = $movement->units->map(fn($u) => [
            'id' => $u->unit_type_id,
            'name' => $u->type->name,
            'attack' => $u->type->attack,
            'defense' => $u->type->defense,
            'carry_capacity' => $u->type->carry_capacity,
            'quantity' => $u->quantity
        ])->toArray();

        // 2. Unidades Defensoras
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

        // 3. EXECUTAR COMBATE
        $result = $this->combatService->resolveBattle($atkUnits, $defUnits);

        // Atualizar tropas defensoras
        foreach ($result['defender_units'] as $unit) {
            Tropas::where('base_id', $targetBase->id)
                ->where('unidade', $unit['name'])
                ->update(['quantidade' => max(0, (int)$unit['quantity'])]);
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

        // 7. Relatório
        \App\Models\Relatorio::create([
            'atacante_id' => $originBase->jogador_id,
            'defensor_id' => $targetBase->jogador_id,
            'vencedor_id' => $result['attacker_won'] ? $originBase->jogador_id : $targetBase->jogador_id,
            'titulo' => "Batalha em " . $targetBase->nome,
            'origem_nome' => $originBase->nome,
            'destino_nome' => $targetBase->nome,
            'detalhes' => array_merge($result, ['loot' => $loot])
        ]);
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

        // PASSO 5 - REDUÇÃO DE LEALDADE
        $reduction = rand(20, 35) * $politicoCount;
        $oldLoyalty = (int) $targetBase->loyalty;
        $newLoyalty = max(0, $oldLoyalty - $reduction);
        
        $targetBase->loyalty = $newLoyalty;
        $targetBase->save();

        Log::channel('game')->warning("[LOYALTY_REDUCED] Base {$targetBase->id}: {$oldLoyalty} -> {$newLoyalty} (-{$reduction})");

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

        // PASSO 8 — CONQUEST: Mudar Owner e Reset Lealdade
        $targetBase->jogador_id = $newOwnerId;
        $targetBase->loyalty = rand(25, 35); // Reset táctico
        $targetBase->nome = "Província de " . ($movement->origin->jogador->username ?? "Jogador {$newOwnerId}");
        $targetBase->save();

        // LIMPEZA DE ESTADO (Idempotência e Segurança)
        DB::table('building_queue')->where('base_id', $targetBase->id)->delete();
        DB::table('unit_queue')->where('base_id', $targetBase->id)->delete();
        DB::table('tropas')->where('base_id', $targetBase->id)->delete();

        Log::channel('game')->emergency("[CONQUEST_EVENT] SETOR {$targetBase->id} CONQUISTADO por Jogador {$newOwnerId} (Antigo: {$oldOwnerId}). Estado Limpo.");
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

        // Distribuímos a capacidade total proporcionalmente ao que existe na base
        $actualLootTotal = min($totalCapacity, $totalAvailable * 0.5); // Saqueamos no máximo 50%

        foreach ($types as $type) {
            $available = max(0, $resources->{$type});
            $ratio = $available / $totalAvailable;
            $stolen = min($available, $actualLootTotal * $ratio);
            
            $loot["loot_{$type}"] = (float) $stolen;
            
            // Deduzir da base alvo (Passo 4/5 - Sanitizado)
            if ($stolen > 0) {
                $resources->decrement($type, $stolen);
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
            $unitName = $mUnit->type->name;
            
            // Adicionar à base destino
            Tropas::updateOrCreate(
                ['base_id' => $base->id, 'unidade' => $unitName],
                ['quantidade' => DB::raw("quantidade + {$mUnit->quantity}")]
            );
        }
    }
}
