<?php
 
namespace App\Services;
 
use App\Models\Base;
use App\Models\Ataque;
use App\Models\Relatorio;
use App\Domain\Combat\CombatRules;
use Illuminate\Support\Facades\DB;
 
class CombatService
{
    /**
     * Lança uma ordem de ataque.
     */
    public function iniciarAtaque(Base $origem, Base $destino, array $tropas, $tipo = 'ataque')
    {
        $dx = $destino->coordenada_x - $origem->coordenada_x;
        $dy = $destino->coordenada_y - $origem->coordenada_y;
        $distancia = sqrt($dx*$dx + $dy*$dy);
        
        $tempo = CombatRules::calculateTravelTime($distancia, $tropas);
 
        return DB::transaction(function() use ($origem, $destino, $tropas, $tipo, $tempo) {
            // Deduzir tropas da base de origem
            foreach ($tropas as $unidade => $qtd) {
                if ($qtd <= 0) continue;
                $tropa = $origem->tropas()->where('unidade', $unidade)->first();
                if (!$tropa || $tropa->quantidade < $qtd) throw new \Exception("Assinaturas de tropas inválidas.");
                $tropa->decrement('quantidade', $qtd);
            }
 
            return Ataque::create([
                'origem_base_id' => $origem->id,
                'destino_base_id' => $destino->id,
                'tropas' => $tropas,
                'tipo' => $tipo,
                'chegada_em' => now()->addSeconds($tempo),
            ]);
        });
    }
 
    /**
     * Resolve um ataque que chegou ao destino.
     */
    public function resolverCombate(Ataque $ataque)
    {
        DB::transaction(function() use ($ataque) {
            $destino = $ataque->destino;
            $origem = $ataque->origem;
            $unidadesConfig = config('game.units');
            
            // 1. Cálculos de força (simplificado para o Domain em seguida se necessário)
            $forcaAtk = 0;
            foreach ($ataque->tropas as $u => $q) $forcaAtk += $q * ($unidadesConfig[$u]['attack'] ?? 0);
            
            $forcaDef = $destino->muralha_nivel * 100;
            foreach ($destino->tropas as $t) $forcaDef += $t->quantidade * ($unidadesConfig[$t->unidade]['defense_general'] ?? 0);
 
            // 2. Usar Domain para resolver a batalha
            $resultado = CombatRules::resolveBattle($forcaAtk, $forcaDef);
            $vitoria = $resultado['vitoriaAtacante'];
            $atrito = $resultado['atrito'];
 
            // 3. Aplicar perdas e saque (Lógica de orquestração)
            $tropasRestantes = [];
            foreach ($ataque->tropas as $u => $q) {
                $perdas = floor($q * ($vitoria ? ($atrito * 0.8) : 1.0));
                $tropasRestantes[$u] = max(0, $q - $perdas);
            }
 
            // Perdas defensor
            foreach ($destino->tropas as $t) {
                $perdas = floor($t->quantidade * ($vitoria ? 1.0 : ($atrito * 0.8)));
                $t->decrement('quantidade', $perdas);
            }
 
            // 4. Loot e Retorno (Pode ser expandido conforme V52.2)
            $saque = ['suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0];
            if ($vitoria) {
                // Cálculo de saque simplificado para MVP
                foreach($saque as $res => $v) {
                    $qtd = floor($destino->recursos->$res * 0.3); // 30% de saque em vitória
                    $saque[$res] = $qtd;
                    $destino->recursos->decrement($res, $qtd);
                    $origem->recursos->increment($res, $qtd);
                }
            }
 
            // Retorno das tropas sobreviventes
            foreach ($tropasRestantes as $u => $q) {
                if ($q <= 0) continue;
                $origem->tropas()->firstOrCreate(['unidade' => $u], ['quantidade' => 0])->increment('quantidade', $q);
            }
 
            // 5. Finalizar missao e gerar relatório
            Relatorio::create([
                'atacante_id' => $origem->jogador_id,
                'defensor_id' => $destino->jogador_id,
                'vitoria' => $vitoria,
                'dados' => ['saque' => $saque, 'perdas_atacante' => $tropasRestantes]
            ]);
 
            $ataque->update(['processado' => true]);
        });
    }
}
