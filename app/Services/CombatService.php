<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Ataque;
use App\Models\Relatorio;
use App\Domain\Combat\CombatRules;
use Illuminate\Support\Facades\DB;

class CombatService
{
    public function iniciarAtaque(Base $origem, ?Base $destino, array $tropas, $tipo = 'ataque', $coords = null)
    {
        if ($destino) {
            $dx = $destino->coordenada_x - $origem->coordenada_x;
            $dy = $destino->coordenada_y - $origem->coordenada_y;
        } elseif ($coords) {
            $dx = $coords['x'] - $origem->coordenada_x;
            $dy = $coords['y'] - $origem->coordenada_y;
        } else {
            throw new \Exception("Nenhum alvo identificado.");
        }

        $distancia = sqrt($dx*$dx + $dy*$dy);
        $tempo = CombatRules::calculateTravelTime($distancia, $tropas);

        return DB::transaction(function() use ($origem, $destino, $tropas, $tipo, $tempo, $coords) {
            foreach ($tropas as $unidade => $qtd) {
                if ($qtd <= 0) continue;
                $tropa = $origem->tropas()->where('unidade', $unidade)->first();
                if (!$tropa || $tropa->quantidade < $qtd) throw new \Exception("Assinaturas de tropas inválidas.");
                $tropa->decrement('quantidade', $qtd);
            }

            return Ataque::create([
                'origem_base_id' => $origem->id,
                'destino_base_id' => $destino ? $destino->id : null,
                'destino_x' => $coords ? $coords['x'] : null,
                'destino_y' => $coords ? $coords['y'] : null,
                'tropas' => $tropas,
                'tipo' => $tipo,
                'chegada_em' => now()->addSeconds($tempo),
            ]);
        });
    }

    public function resolverCombate(Ataque $ataque)
    {
        DB::transaction(function() use ($ataque) {
            $destino = $ataque->destino;
            $origem = $ataque->origem;
            $unidadesConfig = config('game.units');
            
            if (!$destino) {
                Relatorio::create([
                    'atacante_id' => $origem->jogador_id,
                    'defensor_id' => null,
                    'vitoria' => true,
                    'dados' => ['saque' => [], 'perdas_atacante' => [], 'message' => 'Sector vazio.']
                ]);
                $this->iniciarRetorno($ataque, $ataque->tropas, []);
                return;
            }

            $forcaAtk = 0;
            foreach ($ataque->tropas as $u => $q) $forcaAtk += $q * ($unidadesConfig[$u]['attack'] ?? 0);
            
            $forcaDef = $destino->muralha_nivel * 100;
            foreach ($destino->tropas as $t) $forcaDef += $t->quantidade * ($unidadesConfig[$t->unidade]['defense_general'] ?? 0);

            $resultado = CombatRules::resolveBattle($forcaAtk, $forcaDef);
            $vitoria = $resultado['vitoriaAtacante'];
            $atrito = $resultado['atrito'];

            $tropasRestantes = [];
            foreach ($ataque->tropas as $u => $q) {
                $perdas = floor($q * ($vitoria ? ($atrito * 0.8) : 1.0));
                $tropasRestantes[$u] = max(0, $q - $perdas);
            }

            foreach ($destino->tropas as $t) {
                $perdas = floor($t->quantidade * ($vitoria ? 1.0 : ($atrito * 0.8)));
                $t->decrement('quantidade', $perdas);
            }

            $saque = ['suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0];
            if ($vitoria) {
                foreach($saque as $res => $v) {
                    $qtd = floor($destino->recursos->$res * 0.3);
                    $saque[$res] = $qtd;
                    $destino->recursos->decrement($res, $qtd);
                }
            }

            Relatorio::create([
                'atacante_id' => $origem->jogador_id,
                'defensor_id' => $destino->jogador_id,
                'vitoria' => $vitoria,
                'dados' => ['saque' => $saque, 'perdas_atacante' => $tropasRestantes]
            ]);

            $this->iniciarRetorno($ataque, $tropasRestantes, $saque);
        });
    }

    private function iniciarRetorno(Ataque $ataque, array $tropas, array $saque)
    {
        $origem = $ataque->origem;
        if ($ataque->destino) {
            $dx = $ataque->destino->coordenada_x - $origem->coordenada_x;
            $dy = $ataque->destino->coordenada_y - $origem->coordenada_y;
        } else {
            $dx = $ataque->destino_x - $origem->coordenada_x;
            $dy = $ataque->destino_y - $origem->coordenada_y;
        }
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

    public function finalizarRetorno(Ataque $ataque)
    {
        DB::transaction(function() use ($ataque) {
            $origem = $ataque->origem;
            foreach ($ataque->tropas as $u => $q) {
                if ($q <= 0) continue;
                $origem->tropas()->firstOrCreate(['unidade' => $u], ['quantidade' => 0])->increment('quantidade', $q);
            }
            if ($ataque->saque) {
                foreach ($ataque->saque as $res => $qtd) {
                    $origem->recursos->increment($res, $qtd);
                }
            }
            $ataque->delete();
        });
    }
}
鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓 [failed_replace_file_content_reminder]
As a reminder, the last replace_file_content tool call failed because TargetContent was not found in the file.
</failed_replace_file_content_reminder>
