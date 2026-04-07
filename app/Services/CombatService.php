<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Relatorio;

class CombatService
{
    /**
     * Resolve uma batalha entre Atacante e Defensor.
     * Retorna um array com o resultado (Sobreviventes, Perdas, Vencedor).
     */
    public function resolver(array $unidadesAtacantes, Base $baseDefensora, $atacanteId)
    {
        $vencedor = 'defensor';
        $perdasAtacante = [];
        $perdasDefensor = [];
        
        // 1. Calcular Poder Total Atacante
        $poderAtacante = 0;
        foreach ($unidadesAtacantes as $unidade => $quantidade) {
            $conf = config("game.units.{$unidade}");
            $poderAtacante += $conf['attack'] * $quantidade;
        }

        // 2. Calcular Poder Total Defensor
        $poderDefensorGeneral = 0;
        $unidadesDefensoras = $baseDefensora->tropas;
        foreach ($unidadesDefensoras as $tropa) {
            $conf = config("game.units.{$tropa->unidade}");
            $poderDefensorGeneral += $conf['defense_general'] * $tropa->quantidade;
        }

        // Bónus de Muralha: cada nível dá 5% de bónus
        $bonusMuralha = 1 + ($baseDefensora->muralha_nivel * 0.05);
        $poderDefensorTotal = $poderDefensorGeneral * $bonusMuralha;

        // 3. Resolução (Simples para Speed)
        // Atacante vence se Poder Atacante > Poder Defensor
        if ($poderAtacante > $poderDefensorTotal) {
            $vencedor = 'atacante';
            $ratio = $poderDefensorTotal / $poderAtacante; // % de perdas do atacante
            
            // Perdas Atacante
            foreach ($unidadesAtacantes as $unidade => $quantidade) {
                $perdasAtacante[$unidade] = (int)($quantidade * $ratio);
            }
            // Defensor perde tudo
            foreach ($unidadesDefensoras as $tropa) {
                $perdasDefensor[$tropa->unidade] = $tropa->quantidade;
            }
        } else {
            $vencedor = 'defensor';
            $ratio = $poderAtacante / $poderDefensorTotal; // % de perdas do defensor
            
            // Atacante perde tudo
            foreach ($unidadesAtacantes as $unidade => $quantidade) {
                $perdasAtacante[$unidade] = $quantidade;
            }
            // Perdas Defensor
            foreach ($unidadesDefensoras as $tropa) {
                $perdasDefensor[$tropa->unidade] = (int)($tropa->quantidade * $ratio);
            }
        }

        // 4. Calcular Saque (se o atacante vencer)
        $saque = ['suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0];
        if ($vencedor == 'atacante') {
            $capacidadeTotal = 0;
            foreach ($unidadesAtacantes as $unidade => $quantidade) {
                $sobreviventes = $quantidade - ($perdasAtacante[$unidade] ?? 0);
                $capacidadeTotal += config("game.units.{$unidade}.capacity") * $sobreviventes;
            }

            $resDefensor = $baseDefensora->recursos;
            foreach (['suprimentos', 'combustivel', 'municoes'] as $res) {
                $roubado = min($resDefensor->$res * 0.5, $capacidadeTotal / 3);
                $saque[$res] = (int)$roubado;
                $resDefensor->decrement($res, (int)$roubado);
            }
        }

        // 5. Criar Relatório
        Relatorio::create([
            'vencedor_id' => $vencedor == 'atacante' ? $atacanteId : $baseDefensora->jogador_id,
            'titulo' => "Batalha em " . $baseDefensora->nome,
            'origem_nome' => "Base Desconhecida",
            'destino_nome' => $baseDefensora->nome,
            'atacante_id' => $atacanteId,
            'defensor_id' => $baseDefensora->jogador_id,
            'detalhes' => [
                'perdas_atacante' => $perdasAtacante,
                'perdas_defensor' => $perdasDefensor,
                'saque' => $saque,
                'poder_atacante' => (int)$poderAtacante,
                'poder_defensor' => (int)$poderDefensorTotal
            ]
        ]);

        return [
            'vencedor' => $vencedor,
            'perdas_atacante' => $perdasAtacante,
            'perdas_defensor' => $perdasDefensor,
            'saque' => $saque
        ];
    }
}
