<?php

namespace App\Services;

use App\Models\Base;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * QueueIntegrityService - Audit & Repair (PASSO 4 — FASE HARDEN 2).
 * Separação clara entre deteção de erros e execução de correções.
 */
class QueueIntegrityService
{
    /**
     * Valida a integridade das filas e repara se necessário.
     */
    public function validateAndRepair(Base $base): void
    {
        if ($this->needsRepair($base)) {
            $this->repair($base);
        }
    }

    /**
     * Apenas valida o estado (Pure Check).
     */
    public function needsRepair(Base $base): bool
    {
        return $this->checkBuildingQueue($base->id) || $this->checkUnitQueue($base->id);
    }

    private function checkBuildingQueue(int $baseId): bool
    {
        $items = DB::table('building_queue')
            ->where('base_id', $baseId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->get();

        if ($items->isEmpty()) return false;

        $expectedSum = ($items->count() * ($items->count() + 1)) / 2;
        if ($expectedSum !== (int)$items->sum('position')) return true;

        $activeCount = $items->where('status', 'active')->count();
        if ($activeCount !== 1) return true;

        return false;
    }

    private function checkUnitQueue(int $baseId): bool
    {
        $items = DB::table('unit_queue')
            ->where('base_id', $baseId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->get();

        if ($items->isEmpty()) return false;

        $activeCount = $items->where('status', 'active')->count();
        if ($activeCount !== 1) return true;

        return false;
    }

    /**
     * Executa as correções necessárias (Repair).
     */
    public function repair(Base $base): void
    {
        DB::transaction(function() use ($base) {
            Log::channel('game')->warning("[INTEGRITY_REPAIR] Iniciando reparação na base {$base->id}");
            $this->forceReorder('building_queue', $base->id);
            $this->forceReorder('unit_queue', $base->id);
        });
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
        $now = GameClock::now();

        foreach ($items as $item) {
            $update = [
                'position' => $pos,
                'status' => $pos === 1 ? 'active' : 'pending'
            ];

            if ($pos === 1) {
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
