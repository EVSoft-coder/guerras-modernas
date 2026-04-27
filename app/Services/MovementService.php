<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Movement;
use App\Models\MovementUnit;
use App\Models\Unit;
use App\Models\UnitType;
use App\Models\Reinforcement;
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
     * Inicia um movimento militar ou logístico entre bases (Passo 3).
     */
    public function sendTroops(Base $origin, Base $target, array $units, string $type = 'attack', array $cargo = [], ?int $generalId = null): Movement
    {
        return DB::transaction(function() use ($origin, $target, $units, $type, $cargo, $generalId) {
            // Sincronizar recursos antes de qualquer validação tática
            app(ResourceService::class)->syncResources($origin);

            // 1. Validar protecção de novatos
            if ($type === 'attack') {
                if ($target->is_protected && $target->protection_until && $target->protection_until > now()) {
                    throw new \Exception("DIPLOMACIA: Este alvo encontra-se sob Proteção Inicial.");
                }
                
                // Se a origem estiver protegida e atacar, perde a proteção
                if ($origin->is_protected) {
                    $origin->update([
                        'is_protected' => false,
                        'protection_until' => null
                    ]);
                    \Illuminate\Support\Facades\Log::channel('game')->info("[PROTECTION_LOST] Base {$origin->id} perdeu proteção ao atacar.");
                }
            }
            
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

            // 2.5 Aplicar Multiplicador de Evento Mundial (Movimento)
            $eventoMultiplicador = \App\Models\EventoMundo::getMultiplicadorAtivo('movimento');
            $minSpeed *= $eventoMultiplicador;

            // FASE 16: Aplicar Bónus de Logística do General (+5% VEL por nível)
            if ($generalId) {
                $general = \App\Models\General::with('skills')->find($generalId);
                if ($general) {
                    $logisticaLevel = $general->skills->where('skill_slug', 'logistica')->first()?->nivel ?? 0;
                    $minSpeed *= (1 + ($logisticaLevel * 0.05));
                }
            }

            // 3. Calcular Tempo de Viagem (Passo 4 - MapService)
            $travelTimeSeconds = $this->mapService->calculateTravelTime($origin, $target, $minSpeed);
            
            $departure = now();
            $arrival = $departure->copy()->addSeconds($travelTimeSeconds);

            // 4. Criar Movement (Passo 1 - Status: moving)
            $movementData = [
                'origin_id' => $origin->id,
                'target_id' => $target->id,
                'departure_time' => $departure,
                'arrival_time' => $arrival,
                'status' => 'moving',
                'type' => $type,
                'general_id' => $generalId
            ];

            // 4.1 Adicionar Carga (Transporte)
            if (!empty($cargo)) {
                $recursosOrigin = $origin->recursos;
                foreach ($cargo as $res => $amount) {
                    if ($amount > 0) {
                        if ($recursosOrigin->$res < $amount) {
                            throw new \Exception("LOGÍSTICA: Recursos insuficientes para transporte de {$res}.");
                        }
                        $recursosOrigin->decrement($res, $amount);
                        $movementData["loot_{$res}"] = $amount;
                    }
                }
            }

            $movement = Movement::create($movementData);

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
                $lockedMovement->load(['units.type' => function($q) {
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

        if ($movement->type === 'reforco') {
            $this->transferUnitsToReinforcements($movement, $base);
        }

        if ($movement->type === 'attack') {
            $this->handleCombat($movement, $base);
        }

        if ($movement->type === 'espionagem') {
            app(SpyService::class)->resolveSpyMission($movement, $base);
            
            // Após a espionagem, as unidades sobreviventes regressam
            $survivors = $movement->units->map(fn($u) => [
                'id' => $u->unit_type_id,
                'quantity' => $u->quantity
            ])->filter(fn($u) => $u['quantity'] > 0);

            if ($survivors->isNotEmpty()) {
                $this->createReturnMovement($movement, $base, $movement->origin, $survivors);
            }
        }

        if ($movement->type === 'transporte') {
            $this->transferLootToBase($movement, $base);
            
            // Comboio de suprimentos regressa vazio
            $survivors = $movement->units->map(fn($u) => [
                'id' => $u->unit_type_id,
                'quantity' => $u->quantity
            ])->filter(fn($u) => $u['quantity'] > 0);

            if ($survivors->isNotEmpty()) {
                $this->createReturnMovement($movement, $base, $movement->origin, $survivors);
            }
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

        // 2. Unidades Defensoras (Base + Reforços Aliados)
        $defUnitsFromBase = Unit::where('base_id', $targetBase->id)->with('type')->get()->map(function($u) {
            return [
                'origin' => 'base',
                'id' => $u->unit_type_id,
                'name' => $u->type->name,
                'attack' => $u->type->attack,
                'defense' => $u->type->defense,
                'quantity' => $u->quantity
            ];
        })->filter(fn($u) => $u['quantity'] > 0)->toArray();

        $reinforcements = Reinforcement::where('target_base_id', $targetBase->id)->with('type')->get();
        $defUnitsFromReinforcements = $reinforcements->map(function($r) {
            return [
                'origin' => 'reinforcement',
                'reinforcement_id' => $r->id,
                'id' => $r->unit_type_id,
                'name' => $r->type->name,
                'attack' => $r->type->attack,
                'defense' => $r->type->defense,
                'quantity' => $r->quantity
            ];
        })->filter(fn($u) => $u['quantity'] > 0)->toArray();

        $allDefUnits = array_merge($defUnitsFromBase, $defUnitsFromReinforcements);

        $attackerPlayer = $originBase->jogador;
        $defenderPlayer = $targetBase->jogador;

        // FASE 16: Identificar Generais presentes
        $attackerGeneral = null;
        if ($movement->general_id) {
            $attackerGeneral = \App\Models\General::with('skills')->find($movement->general_id);
        }

        $defenderGeneral = $defenderPlayer->general()->with('skills')->where('base_id', $targetBase->id)->first();

        $result = $this->combatService->resolveBattle($atkUnits, $allDefUnits, $attackerPlayer, $defenderPlayer, $targetBase, $attackerGeneral, $defenderGeneral);

        // FASE 16: Atribuir XP ao General Atacante (se presente)
        if ($attackerGeneral) {
            $totalKills = collect($result['defender_units'])->sum('losses');
            $xpGain = max(10, (int)($totalKills * 0.5)); // 0.5 XP por unidade morta, min 10
            app(GeneralService::class)->addExperience($attackerGeneral, $xpGain);
        }

        // FASE 16: Atribuir XP ao General Defensor (se presente na base)
        if ($defenderGeneral) {
            $totalKills = collect($result['attacker_units'])->sum('losses');
            $xpGain = max(10, (int)($totalKills * 0.5));
            app(GeneralService::class)->addExperience($defenderGeneral, $xpGain);
        }

        // Atualizar tropas defensoras (Base + Reforços)
        foreach ($result['defender_units'] as $unit) {
            if ($unit['origin'] === 'base') {
                Unit::where('base_id', $targetBase->id)
                    ->where('unit_type_id', $unit['id'])
                    ->update(['quantity' => max(0, (int)$unit['quantity'])]);
            } else {
                Reinforcement::where('id', $unit['reinforcement_id'])
                    ->update(['quantity' => max(0, (int)$unit['quantity'])]);
            }
        }

        // Limpar reforços que foram totalmente destruídos
        Reinforcement::where('target_base_id', $targetBase->id)->where('quantity', '<=', 0)->delete();

        $loot = [];
        if ($result['attacker_won']) {
            // 4. APLICAR LOOT
            $loot = $this->calculateLoot($result['attacker_units'], $targetBase);
            
            // 5. EXECUTAR CONQUEST (Se político presente)
            $conquest = $this->handlePoliticalAction($movement, $targetBase, $result['attacker_units']);
            if ($conquest) {
                $result['conquest_achieved'] = true;
            }
        }

        // 6. Tratar Sobreviventes
        $survivors = collect($result['attacker_units'])->filter(fn($u) => $u['quantity'] > 0);
        if ($survivors->isNotEmpty()) {
            $this->createReturnMovement($movement, $targetBase, $originBase, $survivors, $loot);
        }

        // 7. Relatório (Persistência em BD - Legacy)
        \App\Models\Relatorio::create([
            'atacante_id' => $originBase->jogador_id,
            'defensor_id' => $targetBase->jogador_id,
            'vencedor_id' => $result['attacker_won'] ? $originBase->jogador_id : $targetBase->jogador_id,
            'titulo' => "Batalha em " . $targetBase->nome,
            'origem_nome' => $originBase->nome,
            'destino_nome' => $targetBase->nome,
            'detalhes' => array_merge($result, ['loot' => $loot])
        ]);

        // 8. Enviar Mensagens Automáticas (FASE 7)
        // Calcular perdas para a mensagem
        $atkLosses = collect($result['attacker_units'])->sum('losses');
        $defLosses = collect($result['defender_units'])->sum('losses');

        \App\Models\Mensagem::criarRelatorioAtaque([
            'atacante_id' => $originBase->jogador_id,
            'defensor_id' => $targetBase->jogador_id,
            'vitoria' => $result['attacker_won'],
            'atk_base' => $originBase->nome,
            'def_base' => $targetBase->nome,
            'atk_perdas' => $atkLosses,
            'def_perdas' => $defLosses,
            'saque' => $loot
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
                'loot_municoes'    => $movement->loot_municoes,
                'general_id'       => $movement->general_id
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
    private function handlePoliticalAction(Movement $movement, Base $targetBase, array $attackerUnits): bool
    {
        // PASSO 4 - DETEÇÃO POLÍTICO
        $politicoCount = 0;
        foreach ($attackerUnits as $unit) {
            if (isset($unit['name']) && strtolower($unit['name']) === 'politico') {
                $politicoCount += (int) $unit['quantity'];
            }
        }

        if ($politicoCount <= 0) return false;

        // PASSO 5 - REDUÇÃO DE LEALDADE (Tribal)
        $loyaltyService = app(LoyaltyService::class);
        $reduction = rand(20, 35) * $politicoCount;
        $newLoyalty = $loyaltyService->reduceLoyalty($targetBase, $reduction);
        
        Log::channel('game')->warning("[CONQUEST] Lealdade reduzida no setor {$targetBase->id} para {$newLoyalty}% (-{$reduction})");

        // PASSO 6 - CONQUISTA
        if ($newLoyalty <= 0) {
            $this->executeConquest($movement, $targetBase);
            return true;
        }

        return false;
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

        // FASE 16: Bónus de Saque do General (+10% por nível)
        if ($movement->general_id) {
            $general = \App\Models\General::with('skills')->find($movement->general_id);
            if ($general) {
                $saqueLevel = $general->skills->where('skill_slug', 'saque')->first()?->nivel ?? 0;
                $totalCapacity *= (1 + ($saqueLevel * 0.10));
            }
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
            'type' => 'return',
            'general_id' => $originalMovement->general_id
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

    /**
     * Transfere as unidades para a tabela de reforços (tropas estacionadas).
     */
    private function transferUnitsToReinforcements(Movement $movement, Base $base): void
    {
        foreach ($movement->units as $mUnit) {
            Reinforcement::create([
                'origin_base_id' => $movement->origin_id,
                'target_base_id' => $base->id,
                'unit_type_id' => $mUnit->unit_type_id,
                'quantity' => $mUnit->quantity
            ]);
        }
    }
}
