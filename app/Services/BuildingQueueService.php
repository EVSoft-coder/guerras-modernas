<?php

namespace App\Services;

use App\Models\Base;
use App\Models\BuildingQueue;
use App\Models\Edificio;
use App\Domain\Building\BuildingType;
use App\Domain\Building\BuildingRules;
use App\Services\TimeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BuildingQueueService
{
    private TimeService $timeService;

    public function __construct(?TimeService $timeService = null)
    {
        $this->timeService = $timeService ?? new TimeService();
    }

    /**
     * Valida se a fila está livre para novas ordens.
     * Fase Crítica - Passo 2.1
     */
    public function validateAvailableQueue(Base $base): void
    {
        $count = BuildingQueue::where('base_id', $base->id)->count();
        if ($count >= 5) {
            throw new \Exception("ENGENHARIA: Fila de projetos saturada (Máx: 5). Aguarde a conclusão de uma obra.");
        }
    }

    /**
     * Inicia uma nova construção na fila.
     * Passo 5: building_id validation
     */
    public function startConstruction(Base $base, string $type, int $posX = 0, int $posY = 0, ?int $buildingId = null)
    {
        $type = BuildingType::normalize($type);
        
        $nivelSincronizado = $this->getCurrentLevel($base, $type);
        
        // PASSO 4 — VALIDAR NÍVEL: target_level = level_future + 1
        $targetLevel = $nivelSincronizado + 1;

        $tempo = BuildingRules::calculateTime($type, $nivelSincronizado);
        $now = $this->timeService->now();
        
        // Calcular delay se já existir queue (sequencial)
        $lastEntry = BuildingQueue::where('base_id', $base->id)->orderBy('finishes_at', 'desc')->first();
        $startTime = ($lastEntry && $lastEntry->finishes_at > $now) ? $lastEntry->finishes_at : $now;

        // PASSO 3 - insertGetId / Create
        return BuildingQueue::create([
            'base_id' => $base->id,
            'building_id' => $buildingId,
            'type' => $type,
            'target_level' => $targetLevel,
            'started_at' => $startTime,
            'finishes_at' => $startTime->copy()->addSeconds($tempo),
        ]);
    }

    /**
     * Processa a fila de construção da base.
     */
    public function processQueue(Base $base)
    {
        $now = $this->timeService->now();
        
        // Selecionar IDs pendentes para evitar problemas de hidratação em coleções passadas por referência
        $pendingIds = BuildingQueue::where('base_id', $base->id)
            ->where('finishes_at', '<=', $now->addSeconds(2))
            ->lockForUpdate() // PASSO 3 - LOCK FOR UPDATE
            ->pluck('id');

        if ($pendingIds->isEmpty()) return;

        DB::transaction(function() use ($base, $pendingIds) {
            foreach ($pendingIds as $id) {
                $entry = BuildingQueue::find($id);
                if (!$entry) continue;

                $this->applyUpgrade($base, $entry->type, $entry->target_level);
                $entry->delete();
                
                Log::info('[CONSTRUCTION_FINISHED]', [
                    'base_id' => $base->id,
                    'type' => $entry->type,
                    'level' => $entry->target_level
                ]);
            }
        });
    }

    /**
     * Aplica o upgrade efetivamente na base de dados.
     */
    private function applyUpgrade(Base $base, string $type, int $level)
    {
        if ($type === BuildingType::QG) {
            $base->qg_nivel = $level;
            $base->save();
        } elseif ($type === BuildingType::MURALHA) {
            $base->muralha_nivel = $level;
            $base->save();
        } else {
            $edificio = $base->edificios()->where('tipo', $type)->first();
            if ($edificio) {
                $edificio->nivel = $level;
                $edificio->save();
            } else {
                $pos = (new GameService($this->timeService))->findNextAvailablePosition($base);
                $base->edificios()->create([
                    'tipo' => $type,
                    'nivel' => $level,
                    'pos_x' => $pos['x'],
                    'pos_y' => $pos['y'],
                ]);
            }
        }
    }

    private function getCurrentLevel(Base $base, string $type): int
    {
        $dbLevel = 0;
        if ($type === BuildingType::QG) $dbLevel = (int) ($base->qg_nivel ?? 0);
        elseif ($type === BuildingType::MURALHA) $dbLevel = (int) ($base->muralha_nivel ?? 0);
        else $dbLevel = (int) ($base->edificios()->where('tipo', $type)->first()?->nivel ?? 0);

        // Somar o número de upgrades deste tipo já na fila para obter o nível futuro
        $maxQueueEntry = BuildingQueue::where('base_id', $base->id)
            ->where('type', $type)
            ->orderBy('target_level', 'desc')
            ->first();

        return (int) max($dbLevel, $maxQueueEntry ? $maxQueueEntry->target_level : 0);
    }
}
