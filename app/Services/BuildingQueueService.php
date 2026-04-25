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
            
            // Sincronizar recursos antes de validar custos (Mutação 1)
            app(ResourceService::class)->syncResources($lockedBase);

            $nivelAtual = (new GameService($this->timeService))->obterNivelEdificio($lockedBase, $type);
            
            $maxTargetInQueue = DB::table('building_queue')
                ->where('base_id', $lockedBase->id)
                ->where('type', $type)
                ->whereNull('cancelled_at')
                ->max('target_level');

            $targetLevel = max($nivelAtual, $maxTargetInQueue ?? 0) + 1;

            $duration = BuildingRules::calculateTime($type, $nivelAtual);
            $custos = BuildingRules::calculateCost($type, $nivelAtual);
            
            // FASE SEGURANÇA: Validar e Debitar Recursos (Atómico)
            $rec = $lockedBase->recursos()->lockForUpdate()->first();
            foreach ($custos as $res => $valor) {
                if ($valor > 0 && (float)$rec->{$res} < $valor) {
                    $atual = (float)$rec->{$res};
                    throw new \Exception("ENGENHARIA: Saldo insuficiente de " . strtoupper($res) . " (Possui: {$atual}, Necessita: {$valor})");
                }
            }

            // Débito
            foreach ($custos as $res => $valor) {
                if ($valor > 0) $rec->decrement($res, $valor);
            }

            $lastItem = BuildingQueue::where('base_id', $base->id)
                ->whereNull('cancelled_at')
                ->orderBy('position', 'desc')
                ->first();

            $now = GameClock::now();
            $startedAt = $lastItem ? $lastItem->finishes_at : $now;
            $finishesAt = $startedAt->copy()->addSeconds($duration);
            $position = ($lastItem ? $lastItem->position : 0) + 1;

            $queue = BuildingQueue::create([
                'base_id' => $base->id,
                'building_id' => $buildingId,
                'position' => $position,
                'type' => $type,
                'target_level' => $targetLevel,
                'duration' => $duration,
                'started_at' => $startedAt,
                'finishes_at' => $finishesAt,
                'cost_suprimentos' => $custos['suprimentos'] ?? 0,
                'cost_combustivel' => $custos['combustivel'] ?? 0,
                'cost_municoes' => $custos['municoes'] ?? 0,
                'cost_metal' => $custos['metal'] ?? 0,
                'cost_energia' => $custos['energia'] ?? 0,
                'status' => 'pending'
            ]);

            Log::channel('game')->info("[GAME_ENGINE] BUILD_START {$base->id}", [
                'type' => $type,
                'target_level' => $targetLevel,
                'queue_id' => $queue->id
            ]);

            return $queue;
        }, 5);
    }

    public function processQueue(Base $base)
    {
        $now = GameClock::now();
        
        DB::transaction(function() use ($base, $now) {
            while (true) {
                $active = BuildingQueue::where('base_id', $base->id)
                    ->where('position', 1)
                    ->whereNull('cancelled_at')
                    ->where('finishes_at', '<=', $now)
                    ->lockForUpdate()
                    ->first();

                if (!$active) break;

                // Guardamos o momento em que este item terminou para encadear o próximo
                $completedAt = $active->finishes_at;

                $this->completeBuilding($active);
                
                // O próximo item deve começar EXATAMENTE quando o anterior acabou
                $this->refreshQueue($base->id, $completedAt);
            }
        }, 5);
    }

    protected function completeBuilding(BuildingQueue $item)
    {
        $base = $item->base;
        $type = $item->type;

        // Sincronizar recursos com a taxa ANTIGA antes de subir o nível (Mutação 2)
        app(ResourceService::class)->syncResources($base);

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

        $item->delete();
        Log::channel('game')->info("[GAME_ENGINE] BUILD_FINISH {$base->id}", [
            'type' => $type,
            'level' => (new GameService($this->timeService))->obterNivelEdificio($base, $type)
        ]);
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

            DB::table('building_queue')->where('id', $item->id)->update(['cancelled_at' => GameClock::now()]);
            DB::table('building_queue')->where('id', $item->id)->delete();

            $this->refreshQueue($base->id);
        }, 5);
    }

    public function refreshQueue(int $baseId, $startTime = null)
    {
        $items = BuildingQueue::where('base_id', $baseId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->get();

        $currentTime = $startTime ?? GameClock::now();
        $pos = 1;

        foreach ($items as $item) {
            $update = [
                'position' => $pos,
                'started_at' => $currentTime,
                'finishes_at' => $currentTime->copy()->addSeconds($item->duration),
                'status' => $pos === 1 ? 'active' : 'pending' // Mantemos por compatibilidade legada, mas a lógica usará tempo
            ];
            
            DB::table('building_queue')->where('id', $item->id)->update($update);
            
            $currentTime = $update['finishes_at'];
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
                DB::table('building_queue')->where('id', $prev->id)->update(['position' => $item->position, 'status' => 'pending', 'started_at' => null, 'finishes_at' => null]);
                DB::table('building_queue')->where('id', $item->id)->update(['position' => $item->position - 1]);
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
                DB::table('building_queue')->where('id', $next->id)->update(['position' => $item->position]);
                DB::table('building_queue')->where('id', $item->id)->update(['position' => $item->position + 1, 'status' => 'pending', 'started_at' => null, 'finishes_at' => null]);
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
