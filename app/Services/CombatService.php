<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

/**
 * CombatService - Centro de Resolução de Batalhas.
 * Calcula o resultado de confrontos militares e perdas de unidades.
 */
class CombatService
{
    /**
     * Resolve uma batalha entre dois grupos de unidades.
     * PASSO 2 e 3 - Lógica de soma de Atacante e Defesa.
     */
    public function resolveBattle(array $attackerUnits, array $defenderUnits): array
    {
        $totalAttack = 0;
        $totalDefense = 0;

        // Calcular Força do Atacante
        foreach ($attackerUnits as $unit) {
            $totalAttack += $unit['attack'] * $unit['quantity'];
        }

        // Calcular Força do Defensor
        foreach ($defenderUnits as $unit) {
            $totalDefense += $unit['defense'] * $unit['quantity'];
        }

        Log::channel('game')->info("[BATTLE] Iniciada: ATK={$totalAttack} vs DEF={$totalDefense}");

        if ($totalAttack <= 0) {
            return $this->formatResult(false, $attackerUnits, $defenderUnits, 0, 1);
        }

        // Determinar Vencedor e Rácio de Perdas (Passo 4)
        if ($totalAttack > $totalDefense) {
            $winner = 'attacker';
            // Se atacante vence, ele perde uma parte menor das tropas
            $attackerLossRatio = min(0.9, $totalDefense / ($totalAttack * 1.5));
            $defenderLossRatio = 1.0; // Defensor na base morre se perder tudo (simplificado)
        } else {
            $winner = 'defender';
            $defenderLossRatio = min(0.9, $totalAttack / ($totalDefense * 1.5));
            $attackerLossRatio = 1.0;
        }

        // Aplicar Perdas (Passo 4)
        $finalAttacker = $this->applyLosses($attackerUnits, $attackerLossRatio);
        $finalDefender = $this->applyLosses($defenderUnits, $defenderLossRatio);

        return $this->formatResult($winner === 'attacker', $finalAttacker, $finalDefender, $totalAttack, $totalDefense);
    }

    /**
     * Aplica redução proporcional às unidades.
     */
    private function applyLosses(array $units, float $ratio): array
    {
        foreach ($units as $key => $unit) {
            $lost = (int) floor($unit['quantity'] * $ratio);
            $units[$key]['quantity'] = max(0, $unit['quantity'] - $lost);
            $units[$key]['losses'] = $lost;
        }
        return $units;
    }

    /**
     * Formata o relatório final da batalha.
     */
    private function formatResult(bool $attackerWon, array $atkUnits, array $defUnits, float $atkPower, float $defPower): array
    {
        return [
            'winner' => $attackerWon ? 'attacker' : 'defender',
            'attacker_won' => $attackerWon,
            'attacker_units' => $atkUnits,
            'defender_units' => $defUnits,
            'stats' => [
                'attack_power' => $atkPower,
                'defense_power' => $defPower
            ]
        ];
    }
}
