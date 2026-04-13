<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Ataque;
use App\Models\Relatorio;
use App\Domain\Combat\CombatRules;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CombatService
{
    /**
     * Inicia uma missão militar, subtraindo tropas da origem e criando o registo de marcha.
     */
    public function iniciarAtaque(Base $origem, ?Base $destino, array $tropas, $tipo = 'ataque', $coords = null)
    {
        if ($destino) {
            $dx = $destino->coordenada_x - $origem->coordenada_x;
            $dy = $destino->coordenada_y - $origem->coordenada_y;
        } elseif ($coords) {
            $dx = $coords['x'] - $origem->coordenada_x;
            $dy = $coords['y'] - $origem->coordenada_y;
        } else {
            throw new \Exception("Nenhum alvo identificado para a missão.");
        }

        $distancia = sqrt($dx*$dx + $dy*$dy);
        $tempo = CombatRules::calculateTravelTime($distancia, $tropas);

        return DB::transaction(function() use ($origem, $destino, $tropas, $tipo, $tempo, $coords) {
            foreach ($tropas as $unidade => $qtd) {
                if ($qtd <= 0) continue;
                $tropa = $origem->tropas()->where('unidade', $unidade)->first();
                if (!$tropa || $tropa->quantidade < $qtd) {
                    throw new \Exception("Assinaturas de tropas inválidas para {$unidade}.");
                }
                $tropa->decrement('quantidade', $qtd);
            }

            return Ataque::create([
                'origem_base_id' => $origem->id,
                'destino_base_id' => $destino ? $destino->id : null,
                'destino_x' => $coords ? $coords['x'] : ($destino ? $destino->coordenada_x : null),
                'destino_y' => $coords ? $coords['y'] : ($destino ? $destino->coordenada_y : null),
                'tropas' => $tropas,
                'tipo' => $tipo,
                'chegada_em' => now()->addSeconds($tempo),
                'processado' => false
            ]);
        });
    }

    /**
     * Resolve o embate militar no destino.
     */
    public function resolverCombate(Ataque $ataque)
    {
        DB::transaction(function() use ($ataque) {
            $origem = $ataque->origem;
            
            // Se não tem destino fixo, tentar localizar base pelas coordenadas
            $destino = $ataque->destino;
            if (!$destino && $ataque->destino_x !== null) {
                $destino = Base::where('coordenada_x', $ataque->destino_x)
                              ->where('coordenada_y', $ataque->destino_y)
                              ->first();
            }

            $unidadesConfig = config('game.units');
            
            // Caso de Sector Vazio (sem base)
            if (!$destino) {
                Relatorio::create([
                    'atacante_id' => $origem->ownerId,
                    'defensor_id' => null,
                    'vitoria' => true,
                    'dados' => [
                        'message' => "Sector [{$ataque->destino_x}:{$ataque->destino_y}] desabitado. Sem resistência encontrada.",
                        'perdas_atacante' => [],
                        'saque' => []
                    ]
                ]);
                $this->iniciarRetorno($ataque, $ataque->tropas, []);
                return;
            }

            // Cálculo de Forças
            $forcaAtk = 0;
            $capacidadeSaqueTotal = 0;
            foreach ($ataque->tropas as $u => $q) {
                $forcaAtk += $q * ($unidadesConfig[$u]['attack'] ?? 0);
                $capacidadeSaqueTotal += $q * ($unidadesConfig[$u]['capacity'] ?? 0);
            }
            
            $forcaDef = $destino->muralha_nivel * 50; // Bónus de muralha
            foreach ($destino->tropas as $t) {
                $forcaDef += $t->quantidade * ($unidadesConfig[$t->unidade]['defense_general'] ?? 0);
            }

            // Resolução de Batalha
            $resultado = CombatRules::resolveBattle($forcaAtk, $forcaDef);
            $vitoria = $resultado['vitoriaAtacante'];
            $atrito = $resultado['atrito'];

            // Aplicar Perdas
            $tropasRestantes = [];
            $perdasAtacanteTotal = [];
            foreach ($ataque->tropas as $u => $q) {
                $perdas = floor($q * ($vitoria ? ($atrito * 0.7) : 1.0));
                $tropasRestantes[$u] = max(0, $q - $perdas);
                $perdasAtacanteTotal[$u] = $perdas;
            }

            $perdasDefensorTotal = [];
            foreach ($destino->tropas as $t) {
                $perdas = floor($t->quantidade * ($vitoria ? 1.0 : ($atrito * 0.7)));
                $t->decrement('quantidade', $perdas);
                $perdasDefensorTotal[$t->unidade] = $perdas;
            }

            // Lógica de Saque Automático
            $saque = ['suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0];
            if ($vitoria) {
                $recursosBase = $destino->recursos;
                $totalDisponivel = $recursosBase->suprimentos + $recursosBase->combustivel + $recursosBase->municoes;
                
                if ($totalDisponivel > 0) {
                    $ratioSaque = min(1, $capacidadeSaqueTotal / $totalDisponivel);
                    foreach(['suprimentos', 'combustivel', 'municoes'] as $res) {
                        $fatorIndividual = ($recursosBase->$res / max(1, $totalDisponivel));
                        $qtdSaque = floor($capacidadeSaqueTotal * $fatorIndividual);
                        $finalQtd = (int) min($recursosBase->$res, $qtdSaque);
                        
                        $saque[$res] = $finalQtd;
                        $recursosBase->decrement($res, $finalQtd);
                    }
                }
            }

            // Gerar Relatório Tático
            Relatorio::create([
                'atacante_id' => $origem->ownerId,
                'defensor_id' => $destino->ownerId,
                'vitoria' => $vitoria,
                'dados' => [
                    'tropa_ataque' => $ataque->tropas,
                    'tropa_defesa' => $destino->tropas->pluck('quantidade', 'unidade')->toArray(),
                    'perdas_atacante' => $perdasAtacanteTotal,
                    'perdas_defensor' => $perdasDefensorTotal,
                    'saque' => $saque,
                    'coords' => "{$ataque->destino_x}:{$ataque->destino_y}"
                ]
            ]);

            $this->iniciarRetorno($ataque, $tropasRestantes, $saque);
        });
    }

    /**
     * Inicia a marcha de regresso após a resolução.
     */
    private function iniciarRetorno(Ataque $ataque, array $tropas, array $saque)
    {
        $origem = $ataque->origem;
        $dx = $ataque->destino_x - $origem->coordenada_x;
        $dy = $ataque->destino_y - $origem->coordenada_y;
        
        $distancia = sqrt($dx*$dx + $dy*$dy);
        $tempo = CombatRules::calculateTravelTime($distancia, $tropas);

        $ataque->update([
            'tipo' => 'retorno',
            'tropas' => $tropas,
            'saque' => $saque,
            'chegada_em' => now()->addSeconds($tempo),
            'processado' => false
        ]);
    }

    /**
     * Finaliza o regresso, devolvendo tropas e recursos à base de origem.
     */
    public function finalizarRetorno(Ataque $ataque)
    {
        DB::transaction(function() use ($ataque) {
            $origem = $ataque->origem;
            if (!$origem) {
                $ataque->delete();
                return;
            }

            foreach ($ataque->tropas as $u => $q) {
                if ($q <= 0) continue;
                $origem->tropas()->firstOrCreate(['unidade' => $u], ['quantidade' => 0])->increment('quantidade', $q);
            }

            if ($ataque->saque) {
                foreach ($ataque->saque as $res => $qtd) {
                    if ($qtd <= 0) continue;
                    $origem->recursos->increment($res, $qtd);
                }
            }
            $ataque->delete();
        });
    }
}

