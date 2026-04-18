<?php

namespace App\Services;

use App\Models\Base;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * QueueIntegrityService - O Sentinela (FASE HARDEN FINAL).
 * Monitoriza e corrige o estado global das filas e ativos da base.
 */
class QueueIntegrityService
{
    /**
     * Valida a integridade das filas da base.
     */
    public function validateQueue(Base $base): void
    {
        DB::transaction(function() use ($base) {
            $this->validateBuildingQueue($base->id);
            $this->validateUnitQueue($base->id);
            $this->validateTemporalConsistency($base->id);
        });
    }

    private function validateBuildingQueue(int $baseId): void
    {
        $items = DB::table('building_queue')
            ->where('base_id', $baseId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->get();

        if ($items->isEmpty()) return;

        $expectedSum = ($items->count() * ($items->count() + 1)) / 2;
        $actualSum = $items->sum('position');

        // PASSO 9 — VALIDAÇÃO: Check de saltos ou duplicados
        if ($expectedSum !== (int)$actualSum || $this->hasDuplicatePositions($items)) {
            Log::channel('game')->warning("[INTEGRITY] BUILDING_QUEUE reorder na base {$baseId}");
            $this->forceReorder('building_queue', $baseId);
        }

        // Apenas um ativo
        $activeCount = $items->where('status', 'active')->count();
        if ($activeCount > 1 || ($activeCount === 0 && $items->isNotEmpty())) {
            Log::channel('game')->error("[INTEGRITY] Status incoerente na BUILDING_QUEUE base {$baseId}");
            $this->forceReorder('building_queue', $baseId);
        }
    }

    private function validateUnitQueue(int $baseId): void
    {
        $items = DB::table('unit_queue')
            ->where('base_id', $baseId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->get();

        if ($items->isEmpty()) return;

        if ($this->hasDuplicatePositions($items)) {
            Log::channel('game')->warning("[INTEGRITY] UNIT_QUEUE reorder na base {$baseId}");
            $this->forceReorder('unit_queue', $baseId);
        }
        
        $activeCount = $items->where('status', 'active')->count();
        if ($activeCount > 1 || ($activeCount === 0 && $items->isNotEmpty())) {
            Log::channel('game')->error("[INTEGRITY] Status incoerente na UNIT_QUEUE base {$baseId}");
            $this->forceReorder('unit_queue', $baseId);
        }
    }

    private function validateTemporalConsistency(int $baseId): void
    {
        // Garante que o item active tem sempre finishes_at e started_at
        $now = now();

        $activeBuild = DB::table('building_queue')
            ->where('base_id', $baseId)
            ->where('status', 'active')
            ->where(function($q) {
                $q->whereNull('started_at')->orWhereNull('finishes_at');
            })->first();

        if ($activeBuild) {
            Log::channel('game')->alert("[INTEGRITY] BUILDING_ACTIVE sem tempos na base {$baseId}. Resetting...");
            $this->forceReorder('building_queue', $baseId);
        }
    }

    private function hasDuplicatePositions($items): bool
    {
        $positions = $items->pluck('position')->toArray();
        return count($positions) !== count(array_unique($positions));
    }

    private function forceReorder(string $table, int $baseId): void
    {
        $items = DB::table($table)
            ->where('base_id', $baseId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        $pos = 1;
        $now = now();

        foreach ($items as $item) {
            $update = [
                'position' => $pos,
                'status' => $pos === 1 ? 'active' : 'pending'
            ];

            if ($pos === 1) {
                // Se estamos a forçar reorder, temos de garantir que o ativo tem tempos
                $update['started_at'] = $item->started_at ?? $now;
                
                $duration = $item->duration ?? 60;
                if ($table === 'unit_queue') {
                    $duration = ($item->duration_per_unit ?? 30) * ($item->quantity_remaining ?? 1);
                }
                $update['finishes_at'] = $item->finishes_at ?? $now->copy()->addSeconds((int)$duration);
            } else {
                $update['started_at'] = null;
                $update['finishes_at'] = null;
            }

            DB::table($table)->where('id', $item->id)->update($update);
            $pos++;
        }
    }
}
