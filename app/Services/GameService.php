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
use Illuminate\Support\Carbon;

/**
 * GameService Centralizado
 * Concentra a lógica core de economia, engenharia e recrutamento.
 */
class GameService
{
    /**
     * Retorna o estado completo da base (Snapshot)
     */
    public function snap(Base $base): array
    {
        return [
            'base' => $base,
            'resources' => $this->calculateResources($base),
            'ultimo_update' => $base->ultimo_update
        ];
    }

    public function getState(Base $base): array
    {
        return $this->snap($base);
    }

    public function calculateResources($base, $now = null)
    {
        if (!$now) $now = Carbon::now();

        // Carregar relação recursos se não carregada
        if (!$base->relationLoaded('recursos')) {
            $base->load('recursos');
        }
        $rec = $base->recursos;

        // Fail-safe: Se não houver linha de recursos, retorna estado base zero
        if (!$rec) {
            return [
                'suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0,
                'pessoal' => 0, 'metal' => 0, 'energia' => 0, 'cap' => 10000,
            ];
        }

        $baseSuprimentos = (float)($rec->suprimentos ?? 0);
        $baseCombustivel = (float)($rec->combustivel ?? 0);
        $baseMunicoes    = (float)($rec->municoes ?? 0);
        $basePessoal     = (float)($rec->pessoal ?? 0);
        $baseMetal       = (float)($rec->metal ?? 0);
        $baseEnergia     = (float)($rec->energia ?? 0);
        $cap         = (int)($rec->cap ?? 10000);

        // Fonte Única de Verdade Temporal: ultimo_update na base
        $lastUpdate = $base->ultimo_update ?? $base->created_at;

        $lastUpdateCarbon = Carbon::parse($lastUpdate);
        
        // Cálculo de Delta Temporal (Segurança acrescida para Carbon 3)
        $seconds = 0;
        if ($now->greaterThan($lastUpdateCarbon)) {
            $seconds = (float)$now->diffInSeconds($lastUpdateCarbon);
        }

        // Taxas de produção por segundo calculadas dinamicamente
        $taxas = $this->obterTaxasProducao($base);
        $rateSup = ($taxas['suprimentos'] ?? 0) / 60;
        $rateComb = ($taxas['combustivel'] ?? 0) / 60;
        $rateMun = ($taxas['municoes'] ?? 0) / 60;
        $rateMetal = ($taxas['metal'] ?? 0) / 60;
        $rateEnergia = ($taxas['energia'] ?? 0) / 60;

        $resources = [
            'suprimentos' => min($cap, max(0, $baseSuprimentos + ($rateSup * $seconds))),
            'combustivel' => min($cap, max(0, $baseCombustivel + ($rateComb * $seconds))),
            'municoes'    => min($cap, max(0, $baseMunicoes + ($rateMun * $seconds))),
            'metal'       => min($cap, max(0, $baseMetal + ($rateMetal * $seconds))),
            'energia'     => min($cap, max(0, $baseEnergia + ($rateEnergia * $seconds))),
            'pessoal'     => $basePessoal,
            'cap'         => $cap,
            'last_update_at' => $lastUpdateCarbon->toDateTimeString(),
            'calculated_at' => $now->toDateTimeString(),
        ];

        return $resources;
    }

    /**
     * PERSISTÊNCIA DE RECURSOS (SYNC)
     * Chamar apenas durante mutações (ações do jogador).
     * Sincroniza todas as tabelas e limpa o buffer temporal.
     */
    public function syncResources(Base $base): void
    {
        $now = Carbon::now();
        $calculated = $this->calculateResources($base, $now);
        
        DB::transaction(function() use ($base, $calculated, $now) {
            // 1. Atualizar tabela de recursos (Legacy Sync)
            DB::table('recursos')
                ->where('base_id', $base->id)
                ->update([
                    'suprimentos' => $calculated['suprimentos'],
                    'combustivel' => $calculated['combustivel'],
                    'municoes'    => $calculated['municoes'],
                    'pessoal'     => $calculated['pessoal'],
                    'metal'       => $calculated['metal'],
                    'energia'     => $calculated['energia'],
                    'updated_at'  => $now
                ]);

            // 2. Atualizar tabela de bases (Modern Sync - Parallel Source)
            DB::table('bases')->where('id', $base->id)->update([
                'ultimo_update' => $now,
                'recursos_metal' => $calculated['metal'],
                'recursos_energia' => $calculated['energia'],
                'recursos_comida' => $calculated['municoes'],
            ]);
        });

        // Mutar instância em memória para garantir consistência em requests longos
        $base->ultimo_update = $now;
        if ($base->relationLoaded('recursos') && $base->recursos) {
            $base->recursos->setRawAttributes(array_merge($calculated, ['updated_at' => $now]), true);
        }
    }

    public function obterTaxasProducao(Base $base): array
    {
        return [
            'metal' => EconomyRules::calculateProductionPerMinute('metal', $this->obterNivelEdificio($base, BuildingType::MINA_METAL)),
            'energia' => EconomyRules::calculateProductionPerMinute('energia', $this->obterNivelEdificio($base, BuildingType::CENTRAL_ENERGIA)),
            'suprimentos' => EconomyRules::calculateProductionPerMinute('suprimentos', $this->obterNivelEdificio($base, BuildingType::MINA_SUPRIMENTOS)),
            'combustivel' => EconomyRules::calculateProductionPerMinute('combustivel', $this->obterNivelEdificio($base, BuildingType::REFINARIA)),
            'municoes' => EconomyRules::calculateProductionPerMinute('municoes', $this->obterNivelEdificio($base, BuildingType::FABRICA_MUNICOES)),
            'pessoal' => EconomyRules::calculateProductionPerMinute('pessoal', $this->obterNivelEdificio($base, BuildingType::POSTO_RECRUTAMENTO)),
        ];
    }

    /**
     * LOGICA DE CONSTRUÇÃO
     * Valida recursos e inicia o upgrade de um edifício.
     */
    public function iniciarUpgrade(Base $base, string $tipoRaw): ?Construcao
    {
        // 0. Sincronizar economia antes de qualquer dedução
        $this->syncResources($base);

        $tipo = BuildingType::normalize($tipoRaw);
        $nivelAtual = $this->obterNivelEdificio($base, $tipo);
        
        $custos = BuildingRules::calculateCost($tipo, $nivelAtual);
        $tempo = BuildingRules::calculateTime($tipo, $nivelAtual);

        // 1. Validar Cap de População (Se o edifício consome slots)
        $stats = $this->obterEstatisticasPopulacao($base);
        $popRequerida = config("game.buildings.{$tipo}.cost.pessoal") ?? 0;

        if ($stats['available'] < $popRequerida) {
            throw new \Exception("LOGÍSTICA: Espaço habitacional insuficiente para suportar esta expansão estrutural. Melhore o Complexo Residencial.");
        }

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
        // 0. Sincronizar economia antes de qualquer dedução
        $this->syncResources($base);

        $custos = UnitRules::calculateCost($unidade, $quantidade);
        $tempo = UnitRules::calculateTime($unidade, $quantidade);

        // 1. Validar Cap de População (Slots Habitacionais)
        $stats = $this->obterEstatisticasPopulacao($base);
        $popRequerida = $custos['pessoal'] ?? 0;

        if ($stats['available'] < $popRequerida) {
            throw new \Exception("LOGÍSTICA: Capacidade habitacional insuficiente para alojar novas tropas. Expanda o Complexo Residencial.");
        }

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
        // Garante persistência do estado atual antes da mutação
        $this->syncResources($base);

        return DB::transaction(function() use ($base, $custos) {
            $rec = $base->recursos;
            if (!$rec) return false;

            // Verificar se há recursos suficientes
            foreach ($custos as $res => $qtd) {
                if ($qtd <= 0) continue;
                $available = (float)($rec->$res ?? 0);
                if ($available < $qtd) return false;
            }

            // Deduzir recursos
            foreach ($custos as $res => $qtd) {
                if ($qtd <= 0) continue;
                $rec->decrement($res, $qtd);
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

    /**
     * ESTATISTICAS DE POPULAÇÃO
     */
    public function obterEstatisticasPopulacao(Base $base): array
    {
        $complexoLevel = $this->obterNivelEdificio($base, BuildingType::HOUSING);
        $total = EconomyRules::calculatePopulationCapacity($complexoLevel);
        
        $configs = config('game.buildings');
        $usedByBuildings = 0;

        // Somar ocupação de edifícios
        foreach ($base->edificios as $edificio) {
            $basePessoal = $configs[$edificio->tipo]['cost']['pessoal'] ?? 0;
            $usedByBuildings += $basePessoal * $edificio->nivel;
        }
        $usedByBuildings += ($configs['qg']['cost']['pessoal'] ?? 0) * $base->qg_nivel;
        $usedByBuildings += ($configs['muralha']['cost']['pessoal'] ?? 0) * $base->muralha_nivel;

        // Somar ocupação de tropas
        $unitConfigs = config('game.units');
        $usedByTroops = 0;
        foreach ($base->tropas as $tropa) {
            $basePessoal = $unitConfigs[$tropa->unidade]['cost']['pessoal'] ?? 1;
            $usedByTroops += $basePessoal * $tropa->quantidade;
        }

        $used = $usedByBuildings + $usedByTroops;

        return [
            'total' => $total,
            'used' => $used,
            'available' => max(0, $total - $used),
            'details' => [
                'buildings' => $usedByBuildings,
                'troops' => $usedByTroops
            ]
        ];
    }
}
