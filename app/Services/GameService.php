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
     * Retorna o estado completo da base (Snapshot)
     */
    public function snap(Base $base): array
    {
        return [
            'base' => $base,
            'resources' => $this->calculateResources($base),
            'last_update_at' => $base->last_update_at
        ];
    }

    public function getState(Base $base): array
    {
        return $this->snap($base);
    }

    public function calculateResources($base)
    {
        // Carregar relação recursos se não carregada
        if (!$base->relationLoaded('recursos')) {
            $base->load('recursos');
        }
        $rec = $base->recursos;

        // Fonte de verdade: tabela `recursos` (que tem dados reais)
        $suprimentos = (float)($rec->suprimentos ?? 0);
        $combustivel = (float)($rec->combustivel ?? 0);
        $municoes    = (float)($rec->municoes ?? 0);
        $pessoal     = (float)($rec->pessoal ?? 0);
        $metal       = (float)($rec->metal ?? 0);
        $energia     = (float)($rec->energia ?? 0);
        $cap         = (int)($rec->cap ?? 10000);

        // Timestamp de referência: ultimo_update na base ou updated_at nos recursos
        $lastUpdate = $base->last_update_at 
            ?? $base->ultimo_update 
            ?? ($rec ? $rec->updated_at : null) 
            ?? $base->created_at;

        if (!$lastUpdate) {
            return [
                'suprimentos' => $suprimentos,
                'combustivel' => $combustivel,
                'municoes'    => $municoes,
                'pessoal'     => $pessoal,
                'metal'       => $metal,
                'energia'     => $energia,
                'cap'         => $cap,
            ];
        }

        $now = now();
        $lastUpdate = \Carbon\Carbon::parse($lastUpdate);
        $seconds = $now->greaterThan($lastUpdate) ? $now->diffInSeconds($lastUpdate) : 0;

        // Taxas de produção por segundo (obtidas dos accessors do modelo)
        $taxas = $this->obterTaxasProducao($base);
        $metalRatePerSec    = ($taxas['suprimentos'] ?? 0) / 60;
        $combRatePerSec     = ($taxas['combustivel'] ?? 0) / 60;
        $municoesRatePerSec = ($taxas['municoes'] ?? 0) / 60;

        $resources = [
            'suprimentos' => min($cap, max(0, $suprimentos + ($metalRatePerSec * $seconds))),
            'combustivel' => min($cap, max(0, $combustivel + ($combRatePerSec * $seconds))),
            'municoes'    => min($cap, max(0, $municoes + ($municoesRatePerSec * $seconds))),
            'pessoal'     => $pessoal,
            'metal'       => $metal,
            'energia'     => $energia,
            'cap'         => $cap,
            'last_update_at' => $lastUpdate->toDateTimeString(),
        ];

        \Illuminate\Support\Facades\Log::info("CALCULATED RESOURCES", $resources);

        return $resources;
    }
    /**
     * ATUALIZAÇÃO DE RECURSOS
     * Calcula a produção passiva baseada no tempo decorrido e persiste na tabela recursos.
     */
    public function atualizarRecursos(Base $base): void
    {
        $calculated = $this->calculateResources($base);
        
        // Persistir na tabela `recursos` (fonte de verdade)
        if ($base->recursos) {
            $base->recursos->update([
                'suprimentos' => $calculated['suprimentos'],
                'combustivel' => $calculated['combustivel'],
                'municoes'    => $calculated['municoes'],
                'pessoal'     => $calculated['pessoal'],
                'metal'       => $calculated['metal'],
                'energia'     => $calculated['energia'],
            ]);
        }

        // Atualizar timestamp na base (usar coluna que existe: ultimo_update)
        $base->ultimo_update = now();
        // Também atualizar last_update_at se a coluna existir
        if (\Schema::hasColumn('bases', 'last_update_at')) {
            $base->last_update_at = now();
        }
        $base->save();
    }

    public function obterTaxasProducao(Base $base): array
    {
        return [
            'metal' => EconomyRules::calculateProductionPerMinute('metal', $this->obterNivelEdificio($base, BuildingType::MINA_METAL)),
            'energia' => EconomyRules::calculateProductionPerMinute('energia', $this->obterNivelEdificio($base, BuildingType::CENTRAL_ENERGIA)),
            'comida' => EconomyRules::calculateProductionPerMinute('comida', $this->obterNivelEdificio($base, BuildingType::FAZENDA)),
            'pessoal' => EconomyRules::calculateProductionPerMinute('pessoal', 
                $this->obterNivelEdificio($base, BuildingType::POSTO_RECRUTAMENTO) + 
                $this->obterNivelEdificio($base, BuildingType::HOUSING)
            ),
            // Legado / Compatibilidade (Mapear para novos nomes atómicos)
            'suprimentos' => EconomyRules::calculateProductionPerMinute('metal', $this->obterNivelEdificio($base, BuildingType::MINA_METAL)),
            'combustivel' => EconomyRules::calculateProductionPerMinute('energia', $this->obterNivelEdificio($base, BuildingType::CENTRAL_ENERGIA)),
            'municoes' => EconomyRules::calculateProductionPerMinute('comida', $this->obterNivelEdificio($base, BuildingType::FAZENDA)),
        ];
    }

    /**
     * LOGICA DE CONSTRUÇÃO
     * Valida recursos e inicia o upgrade de um edifício.
     */
    public function iniciarUpgrade(Base $base, string $tipoRaw): ?Construcao
    {
        // 0. Sincronizar economia antes de qualquer dedução
        $this->atualizarRecursos($base);

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
        $this->atualizarRecursos($base);

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
        $this->atualizarRecursos($base);

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
