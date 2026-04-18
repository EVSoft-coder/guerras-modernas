<?php

namespace App\Services;

use App\Models\Base;
use App\Models\BuildingQueue;
use App\Models\Edificio;
use App\Domain\Building\BuildingType;
use App\Domain\Building\BuildingRules;
use App\Services\TimeService;
use App\Services\GameService;
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
     */
    public function startConstruction(Base $base, string $type, int $posX = 0, int $posY = 0, ?int $buildingId = null)
    {
        return DB::transaction(function() use ($base, $type, $posX, $posY, $buildingId) {
            $type = BuildingType::normalize($type);

            // PASSO 5 - BLOQUEIO DE DUPLICAÇÃO Simultânea
            $existing = BuildingQueue::where('base_id', $base->id)
                ->where('type', $type)
                ->exists();
            
            if ($existing) {
                throw new \Exception("ENGENHARIA: Já existe uma obra em curso ou planeada para " . strtoupper($type));
            }

            // PASSO 6 - LOCK: Bloquear a base
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();
            
            $nivelAtual = (new GameService($this->timeService))->obterNivelEdificio($lockedBase, $type);
            $targetLevel = $nivelAtual + 1;

            $duration = BuildingRules::calculateTime($type, $nivelAtual);
            $custos = BuildingRules::calculateCost($type, $nivelAtual);
            
            // Determinar posição
            $lastPos = BuildingQueue::where('base_id', $base->id)->max('position') ?? 0;
            $position = $lastPos + 1;

            $now = $this->timeService->now();
            
            $queue = BuildingQueue::create([
                'base_id' => $base->id,
                'building_id' => $buildingId,
                'position' => $position,
                'type' => $type,
                'target_level' => $targetLevel,
                'duration' => $duration,
                'status' => $position === 1 ? 'active' : 'pending',
                'started_at' => $position === 1 ? $now : null,
                'finishes_at' => $position === 1 ? $now->copy()->addSeconds($duration) : null,
                'cost_suprimentos' => $custos['suprimentos'] ?? 0,
                'cost_combustivel' => $custos['combustivel'] ?? 0,
                'cost_municoes' => $custos['municoes'] ?? 0,
            ]);

            Log::channel('game')->info('[BUILD_ENQUEUED]', ['id' => $queue->id, 'pos' => $position]);

            return $queue;
        });
    }

    /**
     * Processa a fila de construção da base.
     */
    public function processQueue(Base $base)
    {
        $now = $this->timeService->now();
        
        DB::transaction(function() use ($base, $now) {
            // 1. Verificar o item ativo (position 1)
            $active = BuildingQueue::where('base_id', $base->id)
                ->where('position', 1)
                ->whereNull('cancelled_at')
                ->lockForUpdate()
                ->first();

            if ($active && $active->finishes_at <= $now) {
                // Obra terminou!
                $this->applyUpgrade($base, $active->type, $active->target_level);
                
                Log::channel('game')->info('[CONSTRUCTION_FINISHED]', [
                    'base_id' => $base->id,
                    'type' => $active->type,
                    'level' => $active->target_level
                ]);

                $active->delete();

                // 2. Reordenar e iniciar próximo automaticamente
                $this->refreshQueue($base->id);
            } elseif (!$active) {
                // Se não há ativo mas há pendentes, iniciar o primeiro
                $this->refreshQueue($base->id);
            }
        });
    }

    /**
     * Cancela uma construção.
     */
    public function cancelBuilding(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = BuildingQueue::where('id', $queueId)
                ->whereNull('cancelled_at')
                ->lockForUpdate()
                ->first();
                
            if (!$item) return false;

            $baseId = $item->base_id;
            $base = Base::find($baseId);
            
            // Lock recursos para evitar race condition de reembolso
            $rec = $base->recursos()->lockForUpdate()->first();
            
            // PASSO 5 — CANCELAMENTO SEGURO
            $item->update([
                'cancelled_at' => $this->timeService->now(),
                'status' => 'CANCELLED'
            ]);

            $rec->increment('suprimentos', $item->cost_suprimentos);
            $rec->increment('combustivel', $item->cost_combustivel);
            $rec->increment('municoes', $item->cost_municoes);

            $item->delete();
            $this->refreshQueue($baseId);

            Log::channel('game')->info('[BUILD_CANCELLED_SECURE]', ['base_id' => $baseId, 'type' => $item->type]);

            return true;
        });
    }

    /**
     * Sobe a prioridade de um item.
     */
    public function moveUp(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = BuildingQueue::where('id', $queueId)->lockForUpdate()->first();
            if (!$item || $item->position <= 1) return false;

            $prev = BuildingQueue::where('base_id', $item->base_id)
                ->where('position', $item->position - 1)
                ->first();

            if ($prev) {
                $prev->update(['position' => $item->position]);
                $item->update(['position' => $item->position - 1]);
                $this->refreshQueue($item->base_id);
            }

            return true;
        });
    }

    /**
     * Desce a prioridade de um item.
     */
    public function moveDown(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = BuildingQueue::where('id', $queueId)->lockForUpdate()->first();
            if (!$item) return false;

            $next = BuildingQueue::where('base_id', $item->base_id)
                ->where('position', $item->position + 1)
                ->first();

            if ($next) {
                $next->update(['position' => $item->position]);
                $item->update(['position' => $item->position + 1]);
                $this->refreshQueue($item->base_id);
            }

            return true;
        });
    }

    /**
     * Reordena a fila e garante que o primeiro está ativo.
     */
    private function refreshQueue(int $baseId)
    {
        $items = BuildingQueue::where('base_id', $baseId)
            ->orderBy('position', 'asc')
            ->get();

        $now = $this->timeService->now();
        $pos = 1;

        foreach ($items as $item) {
            $update = ['position' => $pos];
            
            if ($pos === 1) {
                // Se o primeiro não estiver ativo ou mudou (reorder), resetamos o tempo dele
                if ($item->status !== 'active') {
                    $update['status'] = 'active';
                    $update['started_at'] = $now;
                    $update['finishes_at'] = $now->copy()->addSeconds($item->duration);
                }
            } else {
                $update['status'] = 'pending';
                $update['started_at'] = null;
                $update['finishes_at'] = null;
            }

            $item->update($update);
            $pos++;
        }
    }

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
}
