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
        
        // 1. Identificar Unidades de Espionagem Atacantes (Espiões e Drones)
        $attackerSpyPower = 0;
        $spyUnits = [];
        
        foreach ($movement->units as $mUnit) {
            if (!$mUnit->type) continue;
            $name = strtolower($mUnit->type->name);
            if (str_contains($name, 'espiao') || str_contains($name, 'drone')) {
                $attackerSpyPower += $mUnit->quantity;
                $spyUnits[] = [
                    'id' => $mUnit->unit_type_id,
                    'quantity' => $mUnit->quantity
                ];
            }
        }

        // 2. Identificar Espiões Defensores (Contra-Espionagem)
        $defenderSpyPower = Unit::where('base_id', $targetBase->id)
            ->whereHas('type', function($q) {
                $q->where('name', 'like', '%espiao%')
                  ->orWhere('name', 'like', '%drone%');
            })
            ->sum('quantity');

        Log::channel('game')->info("[SPY_MISSION] Base {$originBase->id} power: {$attackerSpyPower} vs Base {$targetBase->id} defense: {$defenderSpyPower}");

        // 3. Resolução de Combate de Espiões
        // Regra: Se o defensor tiver mais poder de espionagem, o atacante perde mais unidades.
        $powerRatio = $defenderSpyPower > 0 ? ($attackerSpyPower / $defenderSpyPower) : 999;
        
        $totalLost = 0;
        if ($defenderSpyPower > 0) {
            // Se atacar com menos espiões do que o defensor tem, a perda é alta.
            if ($powerRatio < 1) {
                $totalLost = (int)($attackerSpyPower * 0.8);
            } elseif ($powerRatio < 2) {
                $totalLost = (int)($attackerSpyPower * 0.4);
            } else {
                $totalLost = (int)($attackerSpyPower * 0.1);
            }
        }

        // Aplicar perdas proporcionalmente às unidades de espionagem
        $survivingSpyPower = 0;
        foreach ($spyUnits as $unit) {
            $loss = $attackerSpyPower > 0 ? (int)(($unit['quantity'] / $attackerSpyPower) * $totalLost) : 0;
            $newQty = max(0, $unit['quantity'] - $loss);
            
            MovementUnit::where('movement_id', $movement->id)
                ->where('unit_type_id', $unit['id'])
                ->update(['quantity' => $newQty]);
            
            // Sync em memória
            foreach ($movement->units as $mUnit) {
                if ($mUnit->unit_type_id === $unit['id']) {
                    $mUnit->quantity = $newQty;
                }
            }
            $survivingSpyPower += $newQty;
        }

        // 4. Gerar Relatório se houver sobreviventes
        if ($survivingSpyPower > 0) {
            $reportData = $this->generateReport($targetBase, $survivingSpyPower, $attackerSpyPower);
            
            Mensagem::create([
                'remetente_id' => null, 
                'destinatario_id' => $originBase->jogador_id,
                'assunto' => "INTELIGÊNCIA: " . $targetBase->nome . " [" . $targetBase->coordenada_x . ":" . $targetBase->coordenada_y . "]",
                'corpo' => "Relatório de reconhecimento obtido pelas nossas unidades.",
                'tipo' => 'espionagem',
                'lida' => false,
                'metadata' => $reportData
            ]);
        } else {
            Mensagem::create([
                'remetente_id' => null,
                'destinatario_id' => $originBase->jogador_id,
                'assunto' => "MISSÃO FRACASSADA: " . $targetBase->nome,
                'corpo' => "As nossas unidades de reconhecimento foram interceptadas. Nenhuma informação foi transmitida.",
                'tipo' => 'espionagem',
                'lida' => false
            ]);
        }

        // 5. Notificar Defensor se detectou algo
        if ($totalLost > 0 || $defenderSpyPower > 0) {
            Mensagem::create([
                'remetente_id' => null,
                'destinatario_id' => $targetBase->jogador_id,
                'assunto' => "CONTRA-ESPIONAGEM: Intrusão Detetada",
                'corpo' => "Unidades de espionagem inimigas tentaram infiltrar-se no setor. Nossas defesas interceptaram algumas unidades.",
                'tipo' => 'espionagem',
                'lida' => false
            ]);
        }
    }

    /**
     * Gera os dados do relatório baseados no sucesso da missão.
     */
    private function generateReport(Base $targetBase, int $surviving, int $totalSent): array
    {
        // Sincronizar recursos para ter dados frescos
        app(ResourceService::class)->syncResources($targetBase);
        $targetBase->load(['recursos', 'edificios', 'units.type']);

        $report = [
            'base_id' => $targetBase->id,
            'base_name' => $targetBase->nome,
            'timestamp' => now()->toDateTimeString(),
            'coords' => "{$targetBase->coordenada_x}:{$targetBase->coordenada_y}",
            'resources' => [],
            'buildings' => [],
            'units' => []
        ];

        // Nível 1: Recursos (Sempre que houver sobreviventes)
        $report['resources'] = [
            'suprimentos' => (int) $targetBase->recursos->suprimentos,
            'combustivel' => (int) $targetBase->recursos->combustivel,
            'municoes'    => (int) $targetBase->recursos->municoes,
            'metal'       => (int) $targetBase->recursos->metal,
            'energia'     => (int) $targetBase->recursos->energia,
        ];

        // Nível 2: Edifícios (Requer mais sucesso)
        if ($surviving >= 2) {
            $report['buildings'] = $targetBase->edificios->map(fn($e) => [
                'type' => $e->tipo, 
                'nivel' => $e->nivel
            ])->toArray();
        }

        // Nível 3: Unidades (Requer infiltração profunda)
        if ($surviving >= 5 || ($surviving == $totalSent && $surviving >= 1)) {
            $report['units'] = $targetBase->units->filter(fn($u) => $u->quantity > 0)->map(fn($u) => [
                'name' => $u->type->name,
                'quantity' => $u->quantity
            ])->toArray();
        }

        return $report;
    }
}
