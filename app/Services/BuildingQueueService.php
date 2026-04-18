<?php

namespace App\Services;

use App\Models\Base;
use App\Domain\Building\BuildingType;
use App\Models\BuildingQueue;
use App\Domain\Building\BuildingRules;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * BuildingQueueService - Engenharia Atómica (FASE HARDEN 3).
 * Gere a fila de construção com suporte a concorrência massiva.
 */
class BuildingQueueService
{
    private TimeService $timeService;

    public function __construct(TimeService $timeService)
    {
        $this->timeService = $timeService;
    }

    public function startConstruction(Base $base, string $type, int $posX = 0, int $posY = 0, ?int $buildingId = null)
    {
        return DB::transaction(function() use ($base, $type, $posX, $posY, $buildingId) {
            $type = BuildingType::normalize($type);

            $existing = BuildingQueue::where('base_id', $base->id)
                ->where('type', $type)
                ->whereNull('cancelled_at')
                ->exists();
            
            if ($existing) {
                throw new \Exception("ENGENHARIA: Já existe uma obra em curso ou planeada para " . strtoupper($type));
            }

            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();
            
            $nivelAtual = (new GameService($this->timeService))->obterNivelEdificio($lockedBase, $type);
            
            $maxTargetInQueue = DB::table('building_queue')
                ->where('base_id', $lockedBase->id)
                ->where('type', $type)
                ->whereNull('cancelled_at')
                ->max('target_level');

            $targetLevel = max($nivelAtual, $maxTargetInQueue ?? 0) + 1;

            $duration = BuildingRules::calculateTime($type, $nivelAtual);
            $custos = BuildingRules::calculateCost($type, $nivelAtual);
            
            $lastPos = BuildingQueue::where('base_id', $base->id)->whereNull('cancelled_at')->max('position') ?? 0;
            $position = $lastPos + 1;

            $now = GameClock::now();
            
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
        }, 5);
    }

    public function processQueue(Base $base)
    {
        $now = GameClock::now();
        
        DB::transaction(function() use ($base, $now) {
            $active = BuildingQueue::where('base_id', $base->id)
                ->where('position', 1)
                ->whereNull('cancelled_at')
                ->lockForUpdate()
                ->first();

            if ($active && $active->finishes_at <= $now) {
                $this->completeBuilding($active);
                $this->refreshQueue($base->id);
            }
        }, 5);
    }

    protected function completeBuilding(BuildingQueue $item)
    {
        $base = $item->base;
        $type = $item->type;

        if ($type === BuildingType::QG) {
            $base->increment('qg_nivel');
        } elseif ($type === BuildingType::MURALHA) {
            $base->increment('muralha_nivel');
        } else {
            $edificio = $base->edificios()->where('tipo', $type)->first();
            if ($edificio) {
                $edificio->increment('nivel');
            } else {
                $base->edificios()->create([
                    'tipo' => $type,
                    'nivel' => 1,
                    'pos_x' => $item->pos_x ?? 0,
                    'pos_y' => $item->pos_y ?? 0,
                ]);
            }
        }

        $item->delete();
        Log::channel('game')->info('[BUILD_COMPLETED]', ['base_id' => $base->id, 'type' => $type]);
    }

    public function cancelBuilding(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = BuildingQueue::where('id', $queueId)->lockForUpdate()->first();
            if (!$item) return;

            $base = $item->base;
            $rec = $base->recursos()->lockForUpdate()->first();

            $rec->increment('suprimentos', $item->cost_suprimentos);
            $rec->increment('combustivel', $item->cost_combustivel);
            $rec->increment('municoes', $item->cost_municoes);

            $item->update(['cancelled_at' => GameClock::now()]);
            $item->delete();

            $this->refreshQueue($base->id);
        }, 5);
    }

    public function refreshQueue(int $baseId)
    {
        $items = BuildingQueue::where('base_id', $baseId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->get();

        $now = GameClock::now();
        $pos = 1;

        foreach ($items as $item) {
            $update = ['position' => $pos];
            if ($pos === 1 && $item->status !== 'active') {
                $update['status'] = 'active';
                $update['started_at'] = $now;
                $update['finishes_at'] = $now->copy()->addSeconds($item->duration);
            }
            $item->update($update);
            $pos++;
        }
    }

    public function moveUp(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = BuildingQueue::where('id', $queueId)->lockForUpdate()->first();
            if (!$item || $item->position <= 1) return;

            $prev = BuildingQueue::where('base_id', $item->base_id)
                ->where('position', $item->position - 1)
                ->whereNull('cancelled_at')
                ->first();

            if ($prev) {
                $prev->update(['position' => $item->position, 'status' => 'pending', 'started_at' => null, 'finishes_at' => null]);
                $item->update(['position' => $item->position - 1]);
                $this->refreshQueue($item->base_id);
            }
        }, 5);
    }

    public function moveDown(int $queueId)
    {
        return DB::transaction(function() use ($queueId) {
            $item = BuildingQueue::where('id', $queueId)->lockForUpdate()->first();
            if (!$item) return;

            $next = BuildingQueue::where('base_id', $item->base_id)
                ->where('position', $item->position + 1)
                ->whereNull('cancelled_at')
                ->first();

            if ($next) {
                $next->update(['position' => $item->position]);
                $item->update(['position' => $item->position + 1, 'status' => 'pending', 'started_at' => null, 'finishes_at' => null]);
                $this->refreshQueue($item->base_id);
            }
        }, 5);
    }

    public function validateAvailableQueue(Base $base)
    {
        $count = BuildingQueue::where('base_id', $base->id)->whereNull('cancelled_at')->count();
        if ($count >= 5) {
            throw new \Exception("ENGENHARIA: Fila de construção saturada (Máx: 5 projetos).");
        }
    }
}
