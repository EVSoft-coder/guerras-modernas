<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Ataque;
use App\Models\Relatorio;
use App\Domain\Combat\CombatRules;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Services\ResourceService;

class CombatService
{
    protected $resourceService;

    public function __construct() {
        $this->resourceService = new ResourceService();
    }
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
                    'atacante_id' => $origem->jogador_id,
                    'defensor_id' => null,
                    'vencedor_id' => $origem->jogador_id,
                    'titulo' => "Exploração de Sector Vazio",
                    'origem_nome' => $origem->nome,
                    'destino_nome' => "[{$ataque->destino_x}:{$ataque->destino_y}]",
                    'detalhes' => [
                        'message' => "Sector [{$ataque->destino_x}:{$ataque->destino_y}] desabitado. Sem resistência encontrada.",
                        'perdas_atacante' => [],
                        'saque' => []
                    ]
                ]);
                $this->iniciarRetorno($ataque, $ataque->tropas, []);
                return;
            }

            // 1. Cálculo de Pontos para Moral (Proporção de Poder)
            $ptsAtk = $this->calculateCombatPoints($origem);
            $ptsDef = $this->calculateCombatPoints($destino);
            $morale = min(1.0, max(0.3, ($ptsDef / max(1, $ptsAtk)) * 3)); // Se atacante é 10x maior, moral desce

            // 2. Sorte do Dia (-25% a +25%)
            $luck = rand(-25, 25) / 100;

            // 3. Especialização de Tropas (Sistema de Pesos Infantaria vs Blindados)
            $unidadesConfig = config('game.units');
            
            $atkInfantry = 0;
            $atkArmored = 0;
            $capacidadeSaqueTotal = 0;

            foreach ($ataque->tropas as $u => $q) {
                $isArmored = in_array($u, ['tanque_combate', 'blindado_apc', 'helicoptero_ataque']);
                if ($isArmored) {
                    $atkArmored += $q * ($unidadesConfig[$u]['attack'] ?? 0);
                } else {
                    $atkInfantry += $q * ($unidadesConfig[$u]['attack'] ?? 0);
                }
                $capacidadeSaqueTotal += $q * ($unidadesConfig[$u]['capacity'] ?? 0);
            }

            $totalAtkRaw = $atkInfantry + $atkArmored;
            
            // Defensor: Proporção de Defesa Baseada na Composição do Atacante
            $forcaDefRaw = 0;
            $ratioAtkArmored = $totalAtkRaw > 0 ? ($atkArmored / $totalAtkRaw) : 0;

            foreach ($destino->tropas as $t) {
                $comp = $unidadesConfig[$t->unidade] ?? [];
                // Defesa ponderada: (Def_Gen * %Infantaria) + (Def_Arm * %Blindados)
                $defPonderada = (($comp['defense_general'] ?? 10) * (1 - $ratioAtkArmored)) 
                              + (($comp['defense_armored'] ?? 5) * $ratioAtkArmored);
                
                $forcaDefRaw += $t->quantidade * $defPonderada;
            }

            // 4. Bónus de Perímetro (Muralha)
            // Cada nível dá +4% de força e uma defesa base (ex: 50 por nível)
            $wallBonus = 1 + ($destino->muralha_nivel * 0.04);
            $forcaDefRaw += ($destino->muralha_nivel * 50);

            // Resolução de Batalha Final
            $resultado = CombatRules::resolveBattle($totalAtkRaw, $forcaDefRaw, [
                'luck' => $luck,
                'morale' => $morale,
                'wallBonus' => $wallBonus
            ]);
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
            $saque = ['metal' => 0, 'energia' => 0, 'municoes' => 0];
            if ($vitoria) {
                // Sincronizar recursos do alvo antes de saquear (OBRIGATÓRIO)
                $this->resourceService->sync($destino);
                $resData = $destino->resources; // Cálculo em tempo real

                $totalDisponivel = $resData['metal'] + $resData['energia'] + $resData['municoes'];
                
                if ($totalDisponivel > 0) {
                    $ratioSaque = min(1, $capacidadeSaqueTotal / $totalDisponivel);
                    foreach(['metal', 'energia', 'municoes'] as $res) {
                        $qtdSaque = floor($capacidadeSaqueTotal * ($resData[$res] / max(1, $totalDisponivel)));
                        $finalQtd = (int) min($resData[$res], $qtdSaque);
                        
                        $saque[$res] = $finalQtd;
                        
                        // Deduzir recursos directamente na tabela unificada
                        if ($destino->recursos) {
                            $destino->recursos->decrement($res, $finalQtd);
                        }
                    }
                }
            }

            // Gerar Relatório Tático conforme DB Schema
            Relatorio::create([
                'atacante_id' => $origem->jogador_id,
                'defensor_id' => $destino->jogador_id,
                'vencedor_id' => $vitoria ? $origem->jogador_id : $destino->jogador_id,
                'titulo' => $vitoria ? "VITÓRIA: Missão em {$destino->nome}" : "DERROTA: Ataque Interceptado em {$destino->nome}",
                'origem_nome' => $origem->nome,
                'destino_nome' => $destino->nome,
                'detalhes' => [
                    'tropa_ataque' => $ataque->tropas,
                    'tropa_defesa' => $destino->tropas->pluck('quantidade', 'unidade')->toArray(),
                    'perdas_atacante' => $perdasAtacanteTotal,
                    'perdas_defensor' => $perdasDefensorTotal,
                    'saque' => $saque,
                    'luck' => $luck,
                    'morale' => $morale,
                    'wallBonus' => $wallBonus,
                    'totalAtk' => $resultado['totalAtk'],
                    'totalDef' => $resultado['totalDef'],
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

            // Sincronizar recursos antes de creditar o saque
            $this->resourceService->sync($origem);

            foreach ($ataque->tropas as $u => $q) {
                if ($q <= 0) continue;
                $origem->tropas()->firstOrCreate(['unidade' => $u], ['quantidade' => 0])->increment('quantidade', $q);
            }

            if ($ataque->saque) {
                foreach ($ataque->saque as $res => $qtd) {
                    if ($qtd <= 0) continue;
                    
                    // Creditar recursos exclusivamente na tabela recursos
                    if ($origem->recursos) {
                        $origem->recursos->increment($res, $qtd);
                    }
                }
            }
            $ataque->delete();
        });
    }

    /**
     * Calcula o valor estratégico (pontos) de uma base para fins de Moral.
     */
    private function calculateCombatPoints(Base $base)
    {
        $pts = ($base->qg_nivel * 10) 
             + ($base->muralha_nivel * 20) 
             + ($base->edificios()->sum('nivel') * 5);
             
        return max(1, $pts);
    }
}

