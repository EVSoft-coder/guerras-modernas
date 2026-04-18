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
        return DB::transaction(function() use ($base, $type, $posX, $posY, $buildingId) {
            $type = BuildingType::normalize($type);

            // PASSO 5 - BLOQUEIO DE DUPLICAÇÃO Simultânea
            // Se já existe o MEMO edifício na fila, impedimos nova ordem para evitar dessincronização
            $existing = BuildingQueue::where('base_id', $base->id)
                ->where('type', $type)
                ->exists();
            
            if ($existing) {
                throw new \Exception("ENGENHARIA: Já existe uma obra em curso ou planeada para " . strtoupper($type));
            }

            // PASSO 4 - LOCK: Bloquear a base para garantir exclusividade na transação
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();
            
            $nivelAtual = (new GameService($this->timeService))->obterNivelEdificio($lockedBase, $type);
            $targetLevel = $nivelAtual + 1;

            $tempo = BuildingRules::calculateTime($type, $nivelAtual);
            $now = $this->timeService->now();
            
            // LOCK FOR UPDATE na fila para sequenciamento
            $lastEntry = BuildingQueue::where('base_id', $base->id)
                ->orderBy('finishes_at', 'desc')
                ->lockForUpdate()
                ->first();

            $startTime = ($lastEntry && $lastEntry->finishes_at > $now) ? $lastEntry->finishes_at : $now;

            return BuildingQueue::create([
                'base_id' => $base->id,
                'building_id' => $buildingId,
                'type' => $type,
                'target_level' => $targetLevel,
                'started_at' => $startTime,
                'finishes_at' => $startTime->copy()->addSeconds($tempo),
            ]);
        });
    }

    /**
     * Processa a fila de construção da base.
     */
    public function processQueue(Base $base)
    {
        $now = $this->timeService->now();
        
        // Selecionar IDs pendentes de forma estrita (Fase 4B - Passo 3)
        $pendingIds = BuildingQueue::where('base_id', $base->id)
            ->where('finishes_at', '<=', $now)
            ->lockForUpdate()
            ->pluck('id');

        if ($pendingIds->isEmpty()) return;

        DB::transaction(function() use ($base, $pendingIds) {
            foreach ($pendingIds as $id) {
                $entry = BuildingQueue::find($id);
                if (!$entry) continue;

                $this->applyUpgrade($base, $entry->type, $entry->target_level);
                $entry->delete();
                
                Log::channel('game')->info('[CONSTRUCTION_FINISHED]', [
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
        // Esta função agora é apenas descritiva, a fonte da verdade é o GameService
        return (new GameService($this->timeService))->obterNivelEdificio($base, $type);
    }
}
