<?php

namespace App\Services;

use App\Models\Base;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class QueueIntegrityService
{
    /**
     * Valida a integridade das filas da base.
     * PASSO 9 — VALIDAÇÃO AUTOMÁTICA
     */
    public function validateQueue(Base $base): void
    {
        DB::transaction(function() use ($base) {
            $this->validateBuildingQueue($base->id);
            $this->validateUnitQueue($base->id);
        });
    }

    private function validateBuildingQueue(int $baseId): void
    {
        $items = DB::table('building_queue')
            ->where('base_id', $baseId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->get();

        $expectedSum = ($items->count() * ($items->count() + 1)) / 2;
        $actualSum = $items->sum('position');

        if ($expectedSum !== (int)$actualSum || $this->hasDuplicatePositions($items)) {
            Log::channel('game')->warning("[INTEGRITY_ALERT] BUILDING_QUEUE saltos de posição detectados na base {$baseId}. Reordenando...");
            $this->forceReorder('building_queue', $baseId);
        }

        // Apenas um ativo
        $activeCount = DB::table('building_queue')
            ->where('base_id', $baseId)
            ->where('status', 'active')
            ->count();

        if ($activeCount > 1) {
            Log::channel('game')->error("[INTEGRITY_ALERT] Múltiplas obras activas na base {$baseId}. Corrigindo...");
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

        if ($this->hasDuplicatePositions($items)) {
            Log::channel('game')->warning("[INTEGRITY_ALERT] UNIT_QUEUE duplicados detectados na base {$baseId}. Reordenando...");
            $this->forceReorder('unit_queue', $baseId);
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
        foreach ($items as $item) {
            DB::table($table)->where('id', $item->id)->update([
                'position' => $pos,
                'status' => $pos === 1 ? 'active' : 'pending'
            ]);
            $pos++;
        }
    }
}
