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
use App\Services\TimeService;
use App\Services\ResourceService;
use App\Services\BuildingQueueService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

/**
 * GameService Centralizado.
 * Concentra a lógica core de economia, engenharia e recrutamento.
 */
class GameService
{
    protected $resourceService;
    protected $buildingQueueService;
    protected $timeService;

    public function __construct(?TimeService $timeService = null) {
        $this->timeService = $timeService ?? new TimeService();
        $this->resourceService = new ResourceService($this->timeService);
        $this->buildingQueueService = new BuildingQueueService($this->timeService);
    }

    /**
     * Retorna o estado completo da base (Snapshot)
     */
    public function snap(Base $base): array
    {
        if (!$base->recursos) $base->load('recursos');
        return [
            'base' => $base,
            'resources' => $this->resourceService->calculate($base->recursos, $this->timeService->now(), $this->obterTaxasProducao($base)),
            'ultimo_update' => $base->ultimo_update
        ];
    }

    public function getState(Base $base): array
    {
        return $this->snap($base);
    }

    public function calculateResources($base, $now = null)
    {
        if (!$base->recursos) $base->load('recursos');
        return $this->resourceService->calculate($base->recursos, $now ?? $this->timeService->now(), $this->obterTaxasProducao($base));
    }

    public function syncResources(Base $base): void
    {
        $this->resourceService->sync($base);
    }

    public function tickResources(Base $base): void
    {
        $this->processarFilas($base);
        $this->syncResources($base);
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

    public function iniciarUpgrade(Base $base, string $tipoRaw, int $posX = 0, int $posY = 0): ?\App\Models\BuildingQueue
    {
        $tipo = BuildingType::normalize($tipoRaw);
        
        return DB::transaction(function() use ($base, $tipo, $posX, $posY) {
            // 1. Verificar se jǭ existe queue (PASSO 2.1)
            $this->buildingQueueService->validateAvailableQueue($base);

            // 2. Sync resources (PASSO 2.2)
            $this->syncResources($base);

            $nivelAtual = $this->obterNivelEdificio($base, $tipo);
            $custos = BuildingRules::calculateCost($tipo, $nivelAtual);

            // 3. Validar recursos e população (PASSO 2.3)
            $stats = $this->obterEstatisticasPopulacao($base);
            $popRequerida = config("game.buildings.{$tipo}.cost.pessoal") ?? 0;

            if ($stats['available'] < $popRequerida) {
                throw new \Exception("LOGÍSTICA: Espaço habitacional insuficiente. Melhore o Complexo Residencial.");
            }

            // 4. Deduzir recursos (PASSO 2.5)
            if (!$this->consumirRecursosInternal($base, $custos)) {
                \Illuminate\Support\Facades\Log::error('[BUILD_FAILED] Saldo insuficiente', ['base_id' => $base->id, 'tipo' => $tipo]);
                throw new \Exception("Logística insuficiente para expansão de estrutura: " . strtoupper($tipo));
            }

            // 5. Obter building_id (PASSO 5)
            $buildingId = null;
            if (!in_array($tipo, [BuildingType::QG, BuildingType::MURALHA])) {
                $buildingId = $base->edificios()->where('tipo', $tipo)->first()?->id;
            }

            \Illuminate\Support\Facades\Log::info('[BUILD_START]', ['base_id' => $base->id, 'tipo' => $tipo]);

            // 6. Criar queue (PASSO 2.4 / PASSO 3)
            $queue = $this->buildingQueueService->startConstruction($base, $tipo, $posX, $posY, $buildingId);

            if (!$queue) {
                 \Illuminate\Support\Facades\Log::error('[BUILD_FAILED] Falha ao criar entrada na fila', ['base_id' => $base->id, 'tipo' => $tipo]);
                 throw new \Exception("ERRO CRÍTICO: Não foi possível registar o plano de engenharia.");
            }

            \Illuminate\Support\Facades\Log::info('[BUILD_QUEUE_CREATED]', ['id' => $queue->id, 'base_id' => $base->id]);

            return $queue;
        });
    }

    /**
     * Versão interna sem transação própria (reaproveita a do chamador)
     */
    private function consumirRecursosInternal(Base $base, array $custos): bool
    {
        $rec = $base->recursos;
        if (!$rec) return false;

        foreach ($custos as $res => $qtd) {
            if ($qtd <= 0) continue;
            $available = (float)($rec->$res ?? 0);
            if ($available < $qtd) return false;
        }

        foreach ($custos as $res => $qtd) {
            if ($qtd <= 0) continue;
            $rec->decrement($res, $qtd);
        }

        return true;
    }

    public function iniciarTreino(Base $base, string $unidade, int $quantidade): Treino
    {
        $this->syncResources($base);

        $custos = UnitRules::calculateCost($unidade, $quantidade);
        $tempo = UnitRules::calculateTime($unidade, $quantidade);

        $stats = $this->obterEstatisticasPopulacao($base);
        $popRequerida = $custos['pessoal'] ?? 0;

        if ($stats['available'] < $popRequerida) {
            throw new \Exception("LOGÍSTICA: Capacidade habitacional insuficiente. Expanda o Complexo Residencial.");
        }

        return DB::transaction(function() use ($base, $unidade, $quantidade, $custos, $tempo) {
            if (!$this->consumirRecursos($base, $custos)) {
                throw new \Exception("Suprimentos insuficientes para mobilização de tropas.");
            }

            return Treino::create([
                'base_id' => $base->id,
                'unidade' => $unidade,
                'quantidade' => $quantidade,
                'completado_em' => $this->timeService->now()->addSeconds($tempo),
            ]);
        });
    }

    public function processarFilas(Base $base): void
    {
        $mudou = false;

        $this->buildingQueueService->processQueue($base);

        $treinos = $base->treinos()->where('completado_em', '<=', $this->timeService->now())->get();
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

    public function consumirRecursos(Base $base, array $custos): bool
    {
        $this->syncResources($base);

        return DB::transaction(function() use ($base, $custos) {
            $rec = $base->recursos;
            if (!$rec) return false;

            foreach ($custos as $res => $qtd) {
                if ($qtd <= 0) continue;
                $available = (float)($rec->$res ?? 0);
                if ($available < $qtd) return false;
            }

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

    public function obterEstatisticasPopulacao(Base $base): array
    {
        $complexoLevel = $this->obterNivelEdificio($base, BuildingType::HOUSING);
        $total = EconomyRules::calculatePopulationCapacity($complexoLevel);
        
        $configs = config('game.buildings');
        $usedByBuildings = 0;

        foreach ($base->edificios as $edificio) {
            $basePessoal = $configs[$edificio->tipo]['cost']['pessoal'] ?? 0;
            $usedByBuildings += $basePessoal * $edificio->nivel;
        }
        $usedByBuildings += ($configs['qg']['cost']['pessoal'] ?? 0) * $base->qg_nivel;
        $usedByBuildings += ($configs['muralha']['cost']['pessoal'] ?? 0) * $base->muralha_nivel;

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

    public function findNextAvailablePosition(Base $base): array
    {
        for ($y = 0; $y < 10; $y++) {
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
