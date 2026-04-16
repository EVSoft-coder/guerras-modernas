<?php

namespace App\Services;

use App\Models\Base;
use App\Models\BuildingQueue;
use App\Models\Edificio;
use App\Domain\Building\BuildingType;
use App\Domain\Building\BuildingRules;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BuildingQueueService
{
    /**
     * Inicia uma nova construção na fila.
     */
    public function startConstruction(Base $base, string $type, int $posX = 0, int $posY = 0)
    {
        $type = BuildingType::normalize($type);
        
        // Obter nível atual (QG e Muralha estão na tabela bases, outros na edificios)
        $nivelAtual = $this->getCurrentLevel($base, $type);
        $targetLevel = $nivelAtual + 1;

        $tempo = BuildingRules::calculateTime($type, $nivelAtual);
        
        return BuildingQueue::create([
            'base_id' => $base->id,
            'type' => $type,
            'target_level' => $targetLevel,
            'started_at' => now(),
            'finishes_at' => now()->addSeconds($tempo),
        ]);
    }

    /**
     * Processa a fila de construção da base.
     */
    public function processQueue(Base $base)
    {
        $pending = BuildingQueue::where('base_id', $base->id)
            ->where('finishes_at', '<=', now())
            ->get();

        if ($pending->isEmpty()) return;

        DB::transaction(function() use ($base, $pending) {
            foreach ($pending as $entry) {
                $this->applyUpgrade($base, $entry->type, $entry->target_level);
                $entry->delete();
            }
        });

        // Opcional: Notificar frontend via Broadcast se necessário
        // broadcast(new \App\Events\BaseUpdated($base))->toOthers();
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
                // Se não existe (nível 1), criar em posição disponível
                $pos = (new GameService())->findNextAvailablePosition($base);
                $base->edificios()->create([
                    'tipo' => $type,
                    'nivel' => $level,
                    'pos_x' => $pos['x'],
                    'pos_y' => $pos['y'],
                ]);
            }
        }
    }

    /**
     * Helper para obter o nível atual.
     */
    private function getCurrentLevel(Base $base, string $type): int
    {
        if ($type === BuildingType::QG) return (int) $base->qg_nivel;
        if ($type === BuildingType::MURALHA) return (int) $base->muralha_nivel;
        return (int) ($base->edificios()->where('tipo', $type)->first()?->nivel ?? 0);
    }
}
