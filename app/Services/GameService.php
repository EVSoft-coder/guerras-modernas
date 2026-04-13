<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Edificio;
use App\Models\Construcao;
use App\Models\Tropa;
use App\Models\Treino;
use App\Domain\Building\BuildingType;
use App\Domain\Building\BuildingRules;
use App\Domain\Unit\UnitRules;
use App\Domain\Economy\EconomyRules;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * GameService Centralizado
 * Concentra a lógica core de economia, engenharia e recrutamento.
 */
class GameService
{
    /**
     * ATUALIZAÇÃO DE RECURSOS
     * Calcula a produção passiva baseada no tempo decorrido.
     */
    public function atualizarRecursos(Base $base): void
    {
        $recursos = $base->recursos;
        if (!$recursos) return;

        $agora = now();
        $ultimaVez = $recursos->updated_at;
        $segundosPassados = $agora->diffInSeconds($ultimaVez);

        if ($segundosPassados <= 0) return;

        $taxasPerMinute = $this->obterTaxasProducao($base);

        foreach ($taxasPerMinute as $res => $rate) {
            $incremento = ($rate / 60) * $segundosPassados;
            $recursos->$res += $incremento;
        }

        $recursos->save();
    }

    public function obterTaxasProducao(Base $base): array
    {
        return [
            'suprimentos' => EconomyRules::calculateProductionPerMinute('suprimentos', $this->obterNivelEdificio($base, BuildingType::MINA_SUPRIMENTOS)),
            'combustivel' => EconomyRules::calculateProductionPerMinute('combustivel', $this->obterNivelEdificio($base, BuildingType::REFINARIA)),
            'municoes' => EconomyRules::calculateProductionPerMinute('municoes', $this->obterNivelEdificio($base, BuildingType::FABRICA_MUNICOES)),
            'pessoal' => EconomyRules::calculateProductionPerMinute('pessoal', $this->obterNivelEdificio($base, BuildingType::POSTO_RECRUTAMENTO)),
            'metal' => EconomyRules::calculateProductionPerMinute('metal', $this->obterNivelEdificio($base, BuildingType::FACTORY)),
            'energia' => EconomyRules::calculateProductionPerMinute('energia', $this->obterNivelEdificio($base, BuildingType::SOLAR)),
        ];
    }

    /**
     * LOGICA DE CONSTRUÇÃO
     * Valida recursos e inicia o upgrade de um edifício.
     */
    public function iniciarUpgrade(Base $base, string $tipoRaw): ?Construcao
    {
        $tipo = BuildingType::normalize($tipoRaw);
        $nivelAtual = $this->obterNivelEdificio($base, $tipo);
        
        $custos = BuildingRules::calculateCost($tipo, $nivelAtual);
        $tempo = BuildingRules::calculateTime($tipo, $nivelAtual);

        return DB::transaction(function() use ($base, $tipo, $custos, $tempo, $nivelAtual) {
            if (!$this->consumirRecursos($base, $custos)) {
                throw new \Exception("Logística insuficiente para expansão de estrutura: " . strtoupper($tipo));
            }

            // Se for nível 0, criamos imediatamente com nível 1 (Doutrina de Fundação Instantânea)
            if ($nivelAtual === 0) {
                if ($tipo === BuildingType::QG) {
                    $base->increment('qg_nivel');
                } elseif ($tipo === BuildingType::MURALHA) {
                    $base->increment('muralha_nivel');
                } else {
                    $base->edificios()->updateOrCreate(
                        ['tipo' => $tipo],
                        ['nivel' => 1]
                    );
                }
                
                broadcast(new \App\Events\BaseUpdated($base))->toOthers();
                return null;
            }

            return Construcao::create([
                'base_id' => $base->id,
                'edificio_tipo' => $tipo,
                'nivel_destino' => $nivelAtual + 1,
                'completado_em' => now()->addSeconds($tempo),
            ]);
        });
    }

    /**
     * LOGICA DE RECRUTAMENTO
     * Valida recursos e inicia o treino de tropas.
     */
    public function iniciarTreino(Base $base, string $unidade, int $quantidade): Treino
    {
        $custos = UnitRules::calculateCost($unidade, $quantidade);
        $tempo = UnitRules::calculateTime($unidade, $quantidade);

        return DB::transaction(function() use ($base, $unidade, $quantidade, $custos, $tempo) {
            if (!$this->consumirRecursos($base, $custos)) {
                throw new \Exception("Suprimentos insuficientes para mobilização de tropas.");
            }

            return Treino::create([
                'base_id' => $base->id,
                'unidade' => $unidade,
                'quantidade' => $quantidade,
                'completado_em' => now()->addSeconds($tempo),
            ]);
        });
    }

    /**
     * PROCESSAMENTO DE FILAS
     * Finaliza construções e treinos que atingiram o tempo limite.
     */
    public function processarFilas(Base $base): void
    {
        $mudou = false;

        // 1. Processar Construções
        $construcoes = $base->construcoes()->where('completado_em', '<=', now())->get();
        foreach ($construcoes as $fila) {
            $mudou = true;
            DB::transaction(function() use ($base, $fila) {
                $tipo = $fila->edificio_tipo;
                if ($tipo === BuildingType::QG) {
                    $base->increment('qg_nivel');
                } elseif ($tipo === BuildingType::MURALHA) {
                    $base->increment('muralha_nivel');
                } else {
                    $edificio = $base->edificios()->where('tipo', $tipo)->first();
                    if ($edificio) {
                        $edificio->increment('nivel');
                    } else {
                        $base->edificios()->create(['tipo' => $tipo, 'nivel' => 1]);
                    }
                }
                $fila->delete();
            });
        }

        // 2. Processar Treinos
        $treinos = $base->treinos()->where('completado_em', '<=', now())->get();
        foreach ($treinos as $fila) {
            $mudou = true;
            DB::transaction(function() use ($base, $fila) {
                $tropa = $base->tropas()->firstOrCreate(
                    ['unidade' => $fila->unidade],
                    ['quantidade' => 0]
                );
                $tropa->increment('quantidade', $fila->quantidade);
                $fila->delete();
            });
        }

        if ($mudou) {
            broadcast(new \App\Events\BaseUpdated($base))->toOthers();
        }
    }

    /**
     * HELPERS ATÓMICOS
     */
    public function consumirRecursos(Base $base, array $custos): bool
    {
        return DB::transaction(function() use ($base, $custos) {
            $recursos = $base->recursos;
            foreach ($custos as $res => $qtd) {
                if ($recursos->$res < $qtd) return false;
            }
            foreach ($custos as $res => $qtd) {
                $recursos->decrement($res, $qtd);
            }
            return true;
        });
    }

    public function obterNivelEdificio(Base $base, string $tipo): int
    {
        if ($tipo === BuildingType::QG) return (int) $base->qg_nivel;
        if ($tipo === BuildingType::MURALHA) return (int) $base->muralha_nivel;
        return (int) ($base->edificios()->where('tipo', $tipo)->first()?->nivel ?? 0);
    }
}
