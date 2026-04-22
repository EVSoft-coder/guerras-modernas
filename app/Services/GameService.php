<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Edificio;
use App\Domain\Building\BuildingType;
use App\Domain\Building\BuildingRules;
use App\Domain\Economy\EconomyRules;
use App\Services\TimeService;
use App\Services\ResourceService;
use App\Services\BuildingQueueService;
use App\Services\GameEngine;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * GameService Centralizado (FASE HARDEN FINAL).
 * Lógica delegada à Sovereign Engine.
 */
class GameService
{
    protected $resourceService;
    protected $buildingQueueService;
    protected $unitQueueService;
    protected $timeService;

    public function __construct(?TimeService $timeService = null) {
        $this->timeService = $timeService ?? new TimeService();
        $this->resourceService = new ResourceService($this->timeService);
        $this->buildingQueueService = new BuildingQueueService($this->timeService);
        $this->unitQueueService = new UnitQueueService($this->timeService);
    }

    /**
     * Retorna o estado completo da base (Snapshot)
     */
    public function snap(Base $base): array
    {
        GameEngine::process($base);
        return [
            'base' => $base,
            'resources' => $this->calculateResources($base, GameClock::now()),
            'ultimo_update' => $base->ultimo_update
        ];
    }

    public function calculateResources(Base $base, $now = null): array
    {
        if (!$base->recursos) $base->load('recursos');
        return $this->resourceService->calculate($base->recursos, $now ?? GameClock::now(), $this->obterTaxasProducao($base));
    }

    public function getState(Base $base): array
    {
        return $this->snap($base);
    }

    public function obterTaxasProducao(Base $base): array
    {
        return $this->resourceService->getRates($base);
    }

    public function iniciarUpgrade(Base $base, string $tipoRaw, int $posX = 0, int $posY = 0): ?\App\Models\BuildingQueue
    {
        $tipo = BuildingType::normalize($tipoRaw);
        
        return DB::transaction(function() use ($base, $tipo, $posX, $posY) {
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();

            $this->buildingQueueService->validateAvailableQueue($lockedBase);

            // PROCESSAMENTO SOBERANO (Garante integridade total antes da ação)
            GameEngine::process($lockedBase);

            $nivelAtual = $this->obterNivelEdificio($lockedBase, $tipo);
            $custos = BuildingRules::calculateCost($tipo, $nivelAtual);

            $stats = $this->obterEstatisticasPopulacao($lockedBase);
            $popRequerida = config("game.buildings.{$tipo}.cost.pessoal") ?? 0;

            if ($stats['available'] < $popRequerida) {
                throw new \Exception("LOGÍSTICA: Espaço habitacional insuficiente. Melhore o Complexo Residencial.");
            }

            if (!$this->consumirRecursosInternal($lockedBase, $custos)) {
                throw new \Exception("Logística insuficiente para expansão de estrutura: " . strtoupper($tipo));
            }

            $buildingId = null;
            if (!in_array($tipo, [BuildingType::HQ, BuildingType::MURALHA])) {
                $buildingId = $lockedBase->edificios()->where('tipo', $tipo)->first()?->id;
            }

            return $this->buildingQueueService->startConstruction($lockedBase, $tipo, $posX, $posY, $buildingId);
        }, 5);
    }

    private function consumirRecursosInternal(Base $base, array $custos): bool
    {
        $rec = $base->recursos;
        if (!$rec) return false;

        foreach ($custos as $res => $qtd) {
            if ($qtd <= 0) continue;
            if ((float)($rec->$res ?? 0) < $qtd) return false;
        }

        foreach ($custos as $res => $qtd) {
            if ($qtd <= 0) continue;
            $rec->decrement($res, $qtd);
        }

        return true;
    }

    public function iniciarTreino(Base $base, int $unitTypeId, int $quantidade): \App\Models\UnitQueue
    {
        return DB::transaction(function() use ($base, $unitTypeId, $quantidade) {
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();
            GameEngine::process($lockedBase);
            return $this->unitQueueService->startRecruitment($lockedBase, $unitTypeId, $quantidade);
        }, 5);
    }

    public function consumirRecursos(Base $base, array $custos): bool
    {
        return DB::transaction(function() use ($base, $custos) {
            GameEngine::process($base);
            return $this->consumirRecursosInternal($base, $custos);
        }, 5);
    }

    public function obterNivelEdificio(Base $base, ?string $tipo): int
    {
        if (is_null($tipo)) return 0;
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

        $usedByTroops = 0;
        foreach ($base->units as $unit) {
            $usedByTroops += $unit->quantity;
        }

        return [
            'total' => $total,
            'used' => ($usedByBuildings + $usedByTroops),
            'available' => max(0, $total - ($usedByBuildings + $usedByTroops))
        ];
    }
}
