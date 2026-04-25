<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Movement;
use App\Models\MovementUnit;
use App\Models\Unit;
use App\Models\Mensagem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * SpyService - Centro de Inteligência e Espionagem.
 * Resolve missões de reconhecimento e gera relatórios de inteligência.
 */
class SpyService
{
    /**
     * Resolve uma missão de espionagem.
     */
    public function resolveSpyMission(Movement $movement, Base $targetBase): void
    {
        $originBase = $movement->origin;
        
        // 1. Identificar Espiões Atacantes
        $attackerSpies = 0;
        $spyUnitTypeId = null;
        
        foreach ($movement->units as $mUnit) {
            if (strtolower($mUnit->type->name) === 'agente_espiao') {
                $attackerSpies += $mUnit->quantity;
                $spyUnitTypeId = $mUnit->unit_type_id;
            }
        }

        // 2. Identificar Espiões Defensores
        $defenderSpies = Unit::where('base_id', $targetBase->id)
            ->whereHas('type', function($q) {
                $q->where('name', 'agente_espiao');
            })
            ->sum('quantity');

        Log::channel('game')->info("[SPY_MISSION] Base {$originBase->id} spies: {$attackerSpies} vs Base {$targetBase->id} defenders: {$defenderSpies}");

        // 3. Resolução de Combate de Espiões
        // Regra: Espiões defensores matam espiões atacantes numa proporção de 1:1 para simplificar, 
        // mas o atacante só perde se o defensor tiver espiões.
        $spiesLost = 0;
        if ($defenderSpies > 0) {
            // Defensores matam alguns atacantes. Se defensores > atacantes, todos os atacantes morrem.
            $spiesLost = min($attackerSpies, (int)($defenderSpies * 1.5)); 
        }

        $survivingSpies = $attackerSpies - $spiesLost;

        // 4. Atualizar movimento com perdas (BD e Memória)
        if ($spyUnitTypeId && $spiesLost > 0) {
            MovementUnit::where('movement_id', $movement->id)
                ->where('unit_type_id', $spyUnitTypeId)
                ->update(['quantity' => $survivingSpies]);
            
            // Sincronizar coleção em memória para o MovementService
            foreach ($movement->units as $mUnit) {
                if ($mUnit->unit_type_id === $spyUnitTypeId) {
                    $mUnit->quantity = $survivingSpies;
                }
            }
        }

        // 5. Gerar Relatório se houver sobreviventes
        if ($survivingSpies > 0) {
            $reportData = $this->generateReport($targetBase, $survivingSpies, $attackerSpies);
            
            Mensagem::create([
                'remetente_id' => null, // Sistema
                'destinatario_id' => $originBase->jogador_id,
                'assunto' => "RELATÓRIO DE INTELIGÊNCIA: " . $targetBase->nome,
                'corpo' => "As nossas unidades de reconhecimento infiltraram-se com sucesso no setor {$targetBase->nome}.",
                'tipo' => 'espionagem',
                'lida' => false,
                'metadata' => $reportData
            ]);
        } else {
            // Missão fracassada - todos os espiões interceptados
            Mensagem::create([
                'remetente_id' => null,
                'destinatario_id' => $originBase->jogador_id,
                'assunto' => "MISSÃO FRACASSADA: " . $targetBase->nome,
                'corpo' => "As nossas unidades de espionagem foram interceptadas e eliminadas antes de transmitirem dados.",
                'tipo' => 'espionagem',
                'lida' => false
            ]);
        }

        // 6. Notificar Defensor (Apenas se ele interceptou alguém)
        if ($spiesLost > 0) {
            Mensagem::create([
                'remetente_id' => null,
                'destinatario_id' => $targetBase->jogador_id,
                'assunto' => "CONTRA-ESPIONAGEM: Infiltrados Detetados",
                'corpo' => "Detetámos e eliminámos unidades de espionagem inimigas a tentar infiltrar-se na nossa base.",
                'tipo' => 'espionagem',
                'lida' => false
            ]);
        }

        // 7. Retorno das Tropas Sobreviventes
        $survivingUnits = $movement->units->filter(fn($u) => $u->quantity > 0);
        if ($survivingUnits->isNotEmpty()) {
            $movementService = app(MovementService::class);
            
            // Simular o createReturnMovement (ou refatorar MovementService para ser público)
            // Por agora, vamos apenas preparar o retorno no MovementService
        }
    }

    /**
     * Gera os dados do relatório baseados no sucesso da missão.
     */
    private function generateReport(Base $targetBase, int $surviving, int $totalSent): array
    {
        $ratio = $surviving / max(1, $totalSent);
        
        // Sincronizar recursos para ter dados frescos
        app(ResourceService::class)->syncResources($targetBase);
        $targetBase->load(['recursos', 'edificios', 'units.type']);

        $report = [
            'base_id' => $targetBase->id,
            'base_name' => $targetBase->nome,
            'timestamp' => now()->toDateTimeString(),
            'resources' => [],
            'buildings' => [],
            'units' => []
        ];

        // Nível 1: Recursos (Sempre que houver sobreviventes)
        $report['resources'] = [
            'suprimentos' => (int) $targetBase->recursos->suprimentos,
            'combustivel' => (int) $targetBase->recursos->combustivel,
            'municoes'    => (int) $targetBase->recursos->municoes,
            'pessoal'     => (int) $targetBase->recursos->pessoal,
        ];

        // Nível 2: Edifícios (Se sobreviverem mais de 50% ou se não houver defesa)
        if ($surviving >= 2 || $totalSent == $surviving) {
            $report['buildings'] = $targetBase->edificios->map(fn($e) => [
                'tipo' => $e->tipo,
                'nivel' => $e->nivel
            ])->toArray();
        }

        // Nível 3: Unidades (Se sobreviverem mais de 80% ou se a defesa for nula)
        if ($surviving >= 5 || ($surviving / $totalSent) >= 0.8) {
            $report['units'] = $targetBase->units->filter(fn($u) => $u->quantity > 0)->map(fn($u) => [
                'name' => $u->type->name,
                'quantity' => $u->quantity
            ])->toArray();
        }

        return $report;
    }
}
