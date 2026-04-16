<?php
 
namespace App\Domain\Combat;
 
class CombatRules
{
    /**
     * Calcula o tempo de viagem baseado na unidade mais lenta e distância.
     */
    public static function calculateTravelTime(float $distancia, array $tropas): int
    {
        $menorVelocidade = 999;
        foreach ($tropas as $unidade => $quantidade) {
            if ($quantidade > 0) {
                $vel = config("game.units.{$unidade}.speed", 10);
                if ($vel < $menorVelocidade) $menorVelocidade = $vel;
            }
        }
 
        $speedMod = config('game.speed.travel', 1);
        $segundos = ($distancia * 100) / ($menorVelocidade * $speedMod);
        
        return (int) max(30, $segundos);
    }
 
    /**
     * Resolve o combate entre atacante e defensor.
     * Incorpora factores de Sorte, Moral e Bónus de Muralha.
     */
    public static function resolveBattle(float $forcaAtaque, float $forcaDefesa, array $params = []): array
    {
        $luck = $params['luck'] ?? 0;        // -0.25 a +0.25
        $morale = $params['morale'] ?? 1.0;  // 0.3 a 1.0
        $wallBonus = $params['wallBonus'] ?? 1.0; 

        // Atacante: Potência afectada por Sorte e Moral
        $totalAtk = $forcaAtaque * (1 + $luck) * $morale;
        
        // Defensor: Potência afectada pela Muralha
        $totalDef = $forcaDefesa * $wallBonus;

        $vitoriaAtacante = $totalAtk > $totalDef;
        
        // Cálculo de atrito (perdas)
        if ($vitoriaAtacante) {
            $ratio = $totalDef / max(1, $totalAtk);
            $atrito = pow($ratio, 1.5); // Perdas suavizadas para o vencedor
        } else {
            $ratio = $totalAtk / max(1, $totalDef);
            $atrito = pow($ratio, 1.5);
        }
        
        return [
            'vitoriaAtacante' => $vitoriaAtacante,
            'atrito' => min(1, $atrito),
            'luck' => $luck,
            'morale' => $morale,
            'wallBonus' => $wallBonus,
            'totalAtk' => $totalAtk,
            'totalDef' => $totalDef
        ];
    }
}
