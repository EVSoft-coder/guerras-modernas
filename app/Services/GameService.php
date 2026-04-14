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
        // 1. Migração Transparente: Se as novas colunas estiverem a zero e houver legado, recuperar dados.
        // Verificamos se recursos_metal é 0 e se a relação 'recursos' existe.
        if ((float)($base->recursos_metal ?? 0) <= 0 && $base->recursos) {
            $base->recursos_metal = (float)$base->recursos->metal;
            $base->recursos_energia = (float)$base->recursos->energia;
            $base->recursos_comida = (float)$base->recursos->comida;
            
            if (!$base->last_update_at) {
                // Sincronizar timestamp do legado
                $base->last_update_at = $base->recursos->updated_at;
            }
        }

        if (!$base->last_update_at) {
            return [
                'metal' => (float)($base->recursos_metal ?? 0),
                'energia' => (float)($base->recursos_energia ?? 0),
                'comida' => (float)($base->recursos_comida ?? 0),
            ];
        }

        $now = now();
        // Garantir que o tempo decorrido nunca seja negativo
        $lastUpdate = $base->last_update_at ?? $base->created_at ?? $now;
        $seconds = $now->greaterThan($lastUpdate) ? $now->diffInSeconds($lastUpdate) : 0;

        return [
            'metal' => max(0, (float)($base->recursos_metal ?? 0) + (max(0, (float)$base->metal_rate) * $seconds)),
            'energia' => max(0, (float)($base->recursos_energia ?? 0) + (max(0, (float)$base->energia_rate) * $seconds)),
            'comida' => max(0, (float)($base->recursos_comida ?? 0) + (max(0, (float)$base->comida_rate) * $seconds)),
            'last_update_at' => $lastUpdate,
        ];
    }
    /**
     * ATUALIZAÇÃO DE RECURSOS
     * Calcula a produção passiva baseada no tempo decorrido.
     */
    public function atualizarRecursos(Base $base): void
    {
        $calculated = $this->calculateResources($base);
        
        $base->update([
            'recursos_metal' => $calculated['metal'],
            'recursos_energia' => $calculated['energia'],
            'recursos_comida' => $calculated['comida'],
            'last_update_at' => now(),
        ]);

        if ($base->recursos) {
            $base->recursos->update([
                'metal' => $calculated['metal'],
                'energia' => $calculated['energia'],
                'comida' => $calculated['comida'],
            ]);
        }
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
            // Mapeamento de chaves legadas para atómicas se necessário
            $map = [
                'suprimentos' => 'recursos_metal',
                'combustivel' => 'recursos_energia',
                'municoes' => 'recursos_comida',
                'metal' => 'recursos_metal',
                'energia' => 'recursos_energia',
                'comida' => 'recursos_comida',
            ];

            foreach ($custos as $res => $qtd) {
                $field = $map[$res] ?? $res;
                if (($base->$field ?? 0) < $qtd) return false;
            }

            foreach ($custos as $res => $qtd) {
                $field = $map[$res] ?? $res;
                $base->decrement($field, $qtd);
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
