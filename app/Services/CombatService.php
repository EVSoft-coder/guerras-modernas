<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Ataque;
use App\Models\Relatorio;
use App\Domain\Combat\CombatRules;
use App\Services\TimeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Services\ResourceService;

class CombatService
{
    protected $resourceService;
    protected $timeService;

    public function __construct(?TimeService $timeService = null) {
        $this->timeService = $timeService ?? new TimeService();
        $this->resourceService = new ResourceService($this->timeService);
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
                'chegada_em' => $this->timeService->now()->addSeconds($tempo),
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
            
            $destino = $ataque->destino;
            if (!$destino && $ataque->destino_x !== null) {
                $destino = Base::where('coordenada_x', $ataque->destino_x)
                              ->where('coordenada_y', $ataque->destino_y)
                              ->first();
            }

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

            $ptsAtk = $this->calculateCombatPoints($origem);
            $ptsDef = $this->calculateCombatPoints($destino);
            $morale = min(1.0, max(0.3, ($ptsDef / max(1, $ptsAtk)) * 3));
            $luck = rand(-25, 25) / 100;

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
            $forcaDefRaw = 0;
            $ratioAtkArmored = $totalAtkRaw > 0 ? ($atkArmored / $totalAtkRaw) : 0;

            foreach ($destino->tropas as $t) {
                $comp = $unidadesConfig[$t->unidade] ?? [];
                $defPonderada = (($comp['defense_general'] ?? 10) * (1 - $ratioAtkArmored)) 
                              + (($comp['defense_armored'] ?? 5) * $ratioAtkArmored);
                $forcaDefRaw += $t->quantidade * $defPonderada;
            }

            $wallBonus = 1 + ($destino->muralha_nivel * 0.04);
            $forcaDefRaw += ($destino->muralha_nivel * 50);

            $resultado = CombatRules::resolveBattle($totalAtkRaw, $forcaDefRaw, [
                'luck' => $luck,
                'morale' => $morale,
                'wallBonus' => $wallBonus
            ]);
            $vitoria = $resultado['vitoriaAtacante'];
            $atrito = $resultado['atrito'];

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

            $saque = ['metal' => 0, 'energia' => 0, 'municoes' => 0];
            if ($vitoria) {
                $this->resourceService->sync($destino);
                $resData = $destino->resources;
                $totalDisponivel = $resData['metal'] + $resData['energia'] + $resData['municoes'];
                
                if ($totalDisponivel > 0) {
                    foreach(['metal', 'energia', 'municoes'] as $res) {
                        $qtdSaque = floor($capacidadeSaqueTotal * ($resData[$res] / max(1, $totalDisponivel)));
                        $finalQtd = (int) min($resData[$res], $qtdSaque);
                        $saque[$res] = $finalQtd;
                        if ($destino->recursos) {
                            $destino->recursos->decrement($res, $finalQtd);
                        }
                    }
                }
            }

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
            'chegada_em' => $this->timeService->now()->addSeconds($tempo),
            'processado' => false
        ]);
    }

    public function finalizarRetorno(Ataque $ataque)
    {
        DB::transaction(function() use ($ataque) {
            $origem = $ataque->origem;
            if (!$origem) {
                $ataque->delete();
                return;
            }

            $this->resourceService->sync($origem);

            foreach ($ataque->tropas as $u => $q) {
                if ($q <= 0) continue;
                $origem->tropas()->firstOrCreate(['unidade' => $u], ['quantidade' => 0])->increment('quantidade', $q);
            }

            if ($ataque->saque) {
                foreach ($ataque->saque as $res => $qtd) {
                    if ($qtd <= 0) continue;
                    if ($origem->recursos) {
                        $origem->recursos->increment($res, $qtd);
                    }
                }
            }
            $ataque->delete();
        });
    }

    private function calculateCombatPoints(Base $base)
    {
        $pts = ($base->qg_nivel * 10) 
             + ($base->muralha_nivel * 20) 
             + ($base->edificios()->sum('nivel') * 5);
             
        return max(1, $pts);
    }
}
