<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Jogador;
use Illuminate\Support\Facades\Log;

/**
 * CombatService - Centro de Resolução de Batalhas.
 * Calcula o resultado de confrontos militares com bónus de pesquisa e muralha.
 */
class CombatService
{
    /**
     * Resolve uma batalha entre dois grupos de unidades.
     * Aplica bónus de pesquisa (ataque/defesa) e muralha (defensor).
     */
    public function resolveBattle(
        array $attackerUnits, 
        array $defenderUnits, 
        ?Jogador $attacker = null, 
        ?Jogador $defender = null,
        ?Base $defenderBase = null,
        $attackerGeneral = null,
        $defenderGeneral = null
    ): array {
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

        // FASE 3: Aplicar Bónus de Pesquisa (Balística / Blindagem)
        $atkBonus = 0;
        $defBonus = 0;

        if ($attacker) {
            $researchService = app(ResearchService::class);
            $atkBonuses = $researchService->getResearchBonuses($attacker);
            $atkBonus = $atkBonuses['attack_bonus'] ?? 0;
            $totalAttack *= (1 + $atkBonus);
        }

        // FASE 16: Bónus do General Atacante
        if ($attackerGeneral) {
            $generalService = app(GeneralService::class);
            $skills = $attackerGeneral->skills;
            $ofensivaLevel = $skills->where('skill_slug', 'ofensiva')->first()?->nivel ?? 0;
            $totalAttack *= (1 + ($ofensivaLevel * 0.03));
        }

        if ($defender) {
            $researchService = app(ResearchService::class);
            $defBonuses = $researchService->getResearchBonuses($defender);
            $defBonus = $defBonuses['defense_bonus'] ?? 0;
            $totalDefense *= (1 + $defBonus);
        }

        // FASE 16: Bónus do General Defensor
        if ($defenderGeneral) {
            $generalService = app(GeneralService::class);
            $skills = $defenderGeneral->skills;
            $defensivaLevel = $skills->where('skill_slug', 'defensiva')->first()?->nivel ?? 0;
            $totalDefense *= (1 + ($defensivaLevel * 0.04));
        }

        // FASE 4: Aplicar Bónus Defensivo da Muralha (+5% DEF por nível)
        $wallBonus = 0;
        if ($defenderBase) {
            $wallLevel = $defenderBase->edificios->where('tipo', 'muralha')->first()?->nivel ?? 0;
            $wallBonus = $wallLevel * 0.05;
            $totalDefense *= (1 + $wallBonus);
        }

        // FASE 5: Aplicar Multiplicador de Evento Mundial (Combate)
        $eventoMultiplicador = \App\Models\EventoMundo::getMultiplicadorAtivo('combate');
        $totalAttack *= $eventoMultiplicador;
        $totalDefense *= $eventoMultiplicador;

        // FASE 14: Fator Sorte (+/- 25%)
        $luck = random_int(-25, 25) / 100;
        $luckMultiplier = 1 + $luck;
        $totalAttack *= $luckMultiplier;

        // FASE 14: Sistema de Moral (Proteção de jogadores pequenos)
        $moral = 100;
        if ($attacker && $defender && $attacker->pontos > 0) {
            // Formula: ((Defender Points / Attacker Points) * 3 + 0.3) * 100
            // Mas limitada entre 30% e 100%
            $moral = (($defender->pontos / $attacker->pontos) * 3 + 0.25) * 100;
            $moral = (int) min(100, max(30, $moral));
            $totalAttack *= ($moral / 100);
        }

        // FASE 14: Bónus Noturno (00:00 - 08:00) -> +100% Defesa
        $hour = (int) date('H');
        $isNight = $hour >= 0 && $hour < 8;
        $nightBonus = $isNight ? 1.0 : 0;
        $totalDefense *= (1 + $nightBonus);

        Log::channel('game')->info("[BATTLE] ATK={$totalAttack} (Luck: {$luck}, Moral: {$moral}%) vs DEF={$totalDefense} (Night: " . ($isNight ? 'YES' : 'NO') . ")");

        if ($totalAttack <= 0) {
            return $this->formatResult(false, $attackerUnits, $defenderUnits, 0, 1, 0, 0, 0, $luck, $moral, $isNight);
        }

        // Determinar Vencedor e Rácio de Perdas
        if ($totalAttack > $totalDefense) {
            $winner = 'attacker';
            $attackerLossRatio = min(0.9, $totalDefense / ($totalAttack * 1.5));
            $defenderLossRatio = 1.0;
        } else {
            $winner = 'defender';
            $defenderLossRatio = min(0.9, $totalAttack / ($totalDefense * 1.5));
            $attackerLossRatio = 1.0;
        }

        // Aplicar Perdas
        $finalAttacker = $this->applyLosses($attackerUnits, $attackerLossRatio);
        $finalDefender = $this->applyLosses($defenderUnits, $defenderLossRatio);

        return $this->formatResult(
            $winner === 'attacker', 
            $finalAttacker, 
            $finalDefender, 
            $totalAttack, 
            $totalDefense,
            $wallBonus,
            $atkBonus,
            $defBonus,
            $luck,
            $moral,
            $isNight
        );
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
    private function formatResult(
        bool $attackerWon, 
        array $atkUnits, 
        array $defUnits, 
        float $atkPower, 
        float $defPower,
        float $wallBonus = 0,
        float $atkResearchBonus = 0,
        float $defResearchBonus = 0,
        float $luck = 0,
        int $moral = 100,
        bool $isNight = false
    ): array {
        return [
            'winner' => $attackerWon ? 'attacker' : 'defender',
            'attacker_won' => $attackerWon,
            'attacker_units' => $atkUnits,
            'defender_units' => $defUnits,
            'stats' => [
                'attack_power' => $atkPower,
                'defense_power' => $defPower,
                'wall_bonus' => $wallBonus,
                'attacker_research_bonus' => $atkResearchBonus,
                'defender_research_bonus' => $defResearchBonus,
                'luck' => $luck,
                'moral' => $moral,
                'night_bonus' => $isNight ? 1.0 : 0,
                'is_night' => $isNight
            ]
        ];
    }
}
