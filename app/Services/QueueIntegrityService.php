<?php

namespace App\Services;

use App\Models\Base;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * QueueIntegrityService - Audit & Repair (PASSO 4 — FASE HARDEN 3).
 * Garante que as filas mantenham a ordem lógica e estados válidos.
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
     * Validação do estado das filas.
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

        // Verificar sequência de posições
        $pos = 1;
        foreach ($items as $item) {
            if ($item->position !== $pos) return true;
            $pos++;
        }

        // Verificar se exatamente 1 está ativo
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

        // Verificar sequência de posições
        $pos = 1;
        foreach ($items as $item) {
            if ($item->position !== $pos) return true;
            $pos++;
        }

        // Verificar status active no primeiro item
        if ($items->first()->status !== 'active') return true;

        return false;
    }

    /**
     * Executa as correções necessárias delegando aos serviços especialistas.
     */
    public function repair(Base $base): void
    {
        DB::transaction(function() use ($base) {
            Log::channel('game')->warning("[INTEGRITY_REPAIR] Reparando base {$base->id}");

            // 1. Reordenar Building Queue
            $this->forcePositionSync('building_queue', $base->id);
            app(BuildingQueueService::class)->refreshQueue($base->id);

            // 2. Reordenar Unit Queue
            $this->forcePositionSync('unit_queue', $base->id);
            app(UnitQueueService::class)->refreshQueue($base->id);
        });
    }

    /**
     * Apenas garante que a coluna 'position' seja uma sequência 1, 2, 3...
     */
    private function forcePositionSync(string $table, int $baseId): void
    {
        $items = DB::table($table)
            ->where('base_id', $baseId)
            ->whereNull('cancelled_at')
            ->orderBy('position', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        $pos = 1;
        foreach ($items as $item) {
            if ($item->position !== $pos) {
                DB::table($table)->where('id', $item->id)->update(['position' => $pos]);
            }
            $pos++;
        }
    }
}
