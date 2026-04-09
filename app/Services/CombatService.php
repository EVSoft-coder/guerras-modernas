<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Relatorio;

class CombatService
{
    /**
     * Resolve uma batalha entre Atacante e Defensor.
     */
    public function resolver(array $unidadesAtacantes, Base $baseDefensora, $atacanteId, $tipo = 'saque', Base $baseOrigem = null)
    {
        if ($tipo === 'espionagem') {
            return $this->resolverEspionagem($unidadesAtacantes, $baseDefensora, $atacanteId);
        }

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

        // 3. Resolução
        if ($poderAtacante > $poderDefensorTotal) {
            $vencedor = 'atacante';
            $ratio = $poderAtacante > 0 ? (min(0.9, ($poderDefensorTotal / $poderAtacante) * 0.8)) : 0;
            
            foreach ($unidadesAtacantes as $unidade => $quantidade) {
                $perdasAtacante[$unidade] = (int)($quantidade * $ratio);
            }
            foreach ($unidadesDefensoras as $tropa) {
                $perdasDefensor[$tropa->unidade] = $tropa->quantidade;
                $tropa->decrement('quantidade', $tropa->quantidade);
            }
        } else {
            $vencedor = 'defensor';
            $ratio = $poderDefensorTotal > 0 ? (min(0.9, ($poderAtacante / $poderDefensorTotal) * 0.8)) : 0;
            
            foreach ($unidadesAtacantes as $unidade => $quantidade) {
                $perdasAtacante[$unidade] = $quantidade;
            }
            foreach ($unidadesDefensoras as $tropa) {
                $perdasDefensor[$tropa->unidade] = (int)($tropa->quantidade * $ratio);
                $tropa->decrement('quantidade', (int)($tropa->quantidade * $ratio));
            }
        }

        // 4. Lógica de Conquista ou Saque
        $saque = ['suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0];
        if ($vencedor == 'atacante') {
            if ($tipo === 'conquista') {
                // RESET TOTAL DA BASE CONQUISTADA: Limpar tropas antigas e filas
                $baseDefensora->tropas()->delete();
                $baseDefensora->construcoes()->delete();
                $baseDefensora->treinos()->delete();

                $baseDefensora->update([
                    'jogador_id' => $atacanteId,
                    'nome' => "Base Conquistada"
                ]);
            } else {
                $capacidadeTotal = 0;
                foreach ($unidadesAtacantes as $unidade => $quantidade) {
                    $sobreviventes = $quantidade - ($perdasAtacante[$unidade] ?? 0);
                    $capacidadeTotal += config("game.units.{$unidade}.capacity", 0) * $sobreviventes;
                }

                $resDefensor = $baseDefensora->recursos;
                $resAtacante = $baseOrigem ? $baseOrigem->recursos : null;

                foreach (['suprimentos', 'combustivel', 'municoes'] as $res) {
                    $roubado = min($resDefensor->$res * 0.5, $capacidadeTotal / 3);
                    $saque[$res] = (int)$roubado;
                    
                    // Debitamos do perdedor e creditamos ao vencedor (se houver base de origem)
                    $resDefensor->decrement($res, (int)$roubado);
                    if ($resAtacante) {
                        $resAtacante->increment($res, (int)$roubado);
                    }
                }
            }
        }

        // 4b. RETORNO DE TROPAS SOBREVIVENTES (Logística de Guerra)
        if ($baseOrigem) {
            foreach ($unidadesAtacantes as $unidade => $quantidade) {
                $sobreviventes = $quantidade - ($perdasAtacante[$unidade] ?? 0);
                if ($sobreviventes > 0) {
                    $tropaLocal = $baseOrigem->tropas()->firstOrCreate(['unidade' => $unidade]);
                    $tropaLocal->increment('quantidade', $sobreviventes);
                }
            }
        }

        // Dados detalhados para o relatório (BAIXAS PRECISSAS)
        $detalhes = [
            'tipo' => $tipo,
            'vitoria' => $vencedor == 'atacante',
            'conquista' => ($tipo === 'conquista' && $vencedor === 'atacante'),
            'saque' => $saque,
            'perdas_atacante' => $perdasAtacante,
            'perdas_defensor' => $perdasDefensor,
            'tropas_atacante_antes' => $unidadesAtacantes,
            'tropas_defensor_antes' => $unidadesDefensoras->pluck('quantidade', 'unidade')->toArray(),
            'tropas_atacante_depois' => collect($unidadesAtacantes)->map(fn($q, $u) => $q - ($perdasAtacante[$u] ?? 0))->toArray(),
            'tropas_defensor_depois' => $unidadesDefensoras->pluck('quantidade', 'unidade')->map(fn($q, $u) => $q - ($perdasDefensor[$u] ?? 0))->toArray(),
        ];

        // 5. Criar Relatório
        Relatorio::create([
            'vencedor_id' => $vencedor == 'atacante' ? $atacanteId : $baseDefensora->jogador_id,
            'titulo' => ($tipo === 'conquista' && $vencedor === 'atacante' ? "CONQUISTA TOTAL" : "Batalha Militar") . " em ({$baseDefensora->coordenada_x}|{$baseDefensora->coordenada_y})",
            'origem_nome' => "Operação Direcionada",
            'destino_nome' => $baseDefensora->nome,
            'atacante_id' => $atacanteId,
            'defensor_id' => $baseDefensora->jogador_id,
            'detalhes' => $detalhes
        ]);

        // 6. Ganhos de Experiência (Comando)
        $xpGanha = 50; // Base por combate
        if (\Illuminate\Support\Facades\Schema::hasColumn('jogadores', 'xp')) {
            if ($vencedor == 'atacante') {
                $baseOrigem->jogador->increment('xp', $xpGanha + 25); // Bónus de ofensiva
            } else {
                $baseDefensora->jogador->increment('xp', $xpGanha);
            }
        }

        return [
            'vencedor' => $vencedor,
            'perdas_atacante' => $perdasAtacante,
            'perdas_defensor' => $perdasDefensor,
            'saque' => $saque,
            'conquista' => ($tipo === 'conquista' && $vencedor === 'atacante')
        ];
    }

    /**
     * Resolve uma missão de reconhecimento (Espionagem).
     */
    protected function resolverEspionagem(array $unidadesAtacantes, Base $baseDefensora, $atacanteId)
    {
        $numEspioes = $unidadesAtacantes['agente_espiao'] ?? 0;
        
        // Se não houver espiões, a missão falha drasticamente
        if ($numEspioes <= 0) {
            Relatorio::create([
                'vencedor_id' => $baseDefensora->jogador_id,
                'titulo' => "FALHA DE INTELIGÊNCIA em ({$baseDefensora->coordenada_x}|{$baseDefensora->coordenada_y})",
                'origem_nome' => "Infiltração Mal-Sucedida",
                'destino_nome' => $baseDefensora->nome,
                'atacante_id' => $atacanteId,
                'defensor_id' => $baseDefensora->jogador_id,
                'detalhes' => ['mensagem' => 'Tentativa de espionagem sem agentes qualificados.']
            ]);
            return ['vencedor' => 'defensor', 'espionagem' => false];
        }

        // Dados recolhidos
        $tropasDetectadas = $baseDefensora->tropas->pluck('quantidade', 'unidade')->toArray();
        $edificiosDetectados = $baseDefensora->edificios->pluck('nivel', 'tipo')->toArray();
        $recursosDetectados = [
            'suprimentos' => $baseDefensora->recursos->suprimentos,
            'combustivel' => $baseDefensora->recursos->combustivel,
            'municoes' => $baseDefensora->recursos->municoes,
        ];

        // Criar Relatório de Inteligência
        Relatorio::create([
            'vencedor_id' => $atacanteId,
            'titulo' => "FICHA DE INTELIGÊNCIA: {$baseDefensora->nome}",
            'origem_nome' => "Agência de Inteligência Central",
            'destino_nome' => $baseDefensora->nome,
            'atacante_id' => $atacanteId,
            'defensor_id' => $baseDefensora->jogador_id,
            'detalhes' => [
                'tipo' => 'espionagem',
                'vitoria' => true,
                'tropas' => $tropasDetectadas,
                'edificios' => $edificiosDetectados,
                'recursos' => $recursosDetectados,
                'num_espioes' => $numEspioes
            ]
        ]);

        return [
            'vencedor' => 'atacante',
            'espionagem' => true,
            'detalhes' => [
                'tropas' => $tropasDetectadas,
                'edificios' => $edificiosDetectados,
                'recursos' => $recursosDetectados
            ]
        ];
    }
}
