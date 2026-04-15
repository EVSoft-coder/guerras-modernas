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

use App\Services\ResourceService;

/**
 * GameService Centralizado
 * Concentra a lógica core de economia, engenharia e recrutamento.
 */
class GameService
{
    protected $resourceService;

    public function __construct() {
        $this->resourceService = new ResourceService();
    }
    /**
     * Retorna o estado completo da base (Snapshot)
     */
    public function snap(Base $base): array
    {
        if (!$base->recursos) $base->load('recursos');
        return [
            'base' => $base,
            'resources' => $this->resourceService->calculate($base->recursos, null, $this->obterTaxasProducao($base)),
            'ultimo_update' => $base->ultimo_update
        ];
    }

    public function getState(Base $base): array
    {
        return $this->snap($base);
    }

    /**
     * PROXY PARA RESOURCE SERVICE
     */
    public function calculateResources($base, $now = null)
    {
        if (!$base->recursos) $base->load('recursos');
        return $this->resourceService->calculate($base->recursos, $now, $this->obterTaxasProducao($base));
    }

    public function syncResources(Base $base): void
    {
        $this->resourceService->sync($base);
    }

    /**
     * TICKER DE RECURSOS (Fase 4 - Estabilidade)
     * Realiza o tick completo e persiste na base de dados.
     */
    public function tickRecursos(Base $base): void
    {
        $this->syncResources($base);
    }

    public function tickResources(Base $base): void
    {
        $this->tickRecursos($base);
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
    public function iniciarUpgrade(Base $base, string $tipoRaw, int $posX = 0, int $posY = 0): ?Construcao
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

        // CORREÇÃO 5 — BACKEND VALIDATION (Layout Determinístico)
        if ($nivelAtual === 0 && !in_array($tipo, [BuildingType::QG, BuildingType::MURALHA])) {
            // Se as coordenadas forem 0,0, assumimos que o jogador quer "Auto-Place" ou é um comando antigo
            if ($posX === 0 && $posY === 0) {
                $pos = $this->findNextAvailablePosition($base);
                $posX = $pos['x'];
                $posY = $pos['y'];
            }

            $exists = DB::table('edificios')
                ->where('base_id', $base->id)
                ->where('pos_x', $posX)
                ->where('pos_y', $posY)
                ->exists();
            
            if ($exists) {
                // Se colidir, tentamos encontrar o próximo livre de qualquer forma
                $pos = $this->findNextAvailablePosition($base);
                $posX = $pos['x'];
                $posY = $pos['y'];
            }
        }

        return DB::transaction(function() use ($base, $tipo, $custos, $tempo, $nivelAtual, $posX, $posY) {
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
                        ['nivel' => 1, 'pos_x' => $posX, 'pos_y' => $posY]
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
                        $pos = $this->findNextAvailablePosition($base);
                        $base->edificios()->create([
                            'tipo' => $tipo, 
                            'nivel' => 1,
                            'pos_x' => $pos['x'],
                            'pos_y' => $pos['y']
                        ]);
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

    /**
     * LOCALIZADOR DE ESPAÇO TÁCTICO
     * Encontra a primeira célula livre na grelha 5x5.
     */
    public function findNextAvailablePosition(Base $base): array
    {
        for ($y = 0; $y < 10; $y++) { // Aumentado para 10 para expansão futura
            for ($x = 0; $x < 5; $x++) {
                $isOccupied = DB::table('edificios')
                    ->where('base_id', $base->id)
                    ->where('pos_x', $x)
                    ->where('pos_y', $y)
                    ->exists();
                
                if (!$isOccupied) {
                    return ['x' => $x, 'y' => $y];
                }
            }
        }
        return ['x' => 0, 'y' => 0];
    }
}
