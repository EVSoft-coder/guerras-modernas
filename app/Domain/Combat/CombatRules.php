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
     * Retorna [vitoria_atacante, ratio_perdas, perdas_atacante, perdas_defensor]
     */
    public static function resolveBattle(float $forcaAtaque, float $forcaDefesa): array
    {
        $vitoriaAtacante = $forcaAtaque > $forcaDefesa;
        $ratio = $vitoriaAtacante ? ($forcaDefesa / max(1, $forcaAtaque)) : ($forcaAtaque / max(1, $forcaDefesa));
        $atrito = min(1, $ratio * 1.2); 
 
        return [
            'vitoriaAtacante' => $vitoriaAtacante,
            'atrito' => $atrito
        ];
    }
}
