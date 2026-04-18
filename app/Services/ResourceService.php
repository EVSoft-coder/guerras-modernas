<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Recurso;
use App\Services\TimeService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * ResourceService - Doutrina de Persistência Atómica (FASE HARDEN 2).
 * Implementa "1 sync per cycle" e logging categorizado.
 */
class ResourceService
{
    private TimeService $timeService;
    
    // Rastreio de bases já sincronizadas no ciclo atual para evitar redundância
    protected static array $syncedThisCycle = [];

    public function __construct(?TimeService $timeService = null)
    {
        $this->timeService = $timeService ?? new TimeService();
    }

    /**
     * Sincroniza a base com o tempo real.
     * PASSO 1 — RESOURCE SYNC: apenas 1 sync real por ciclo.
     */
    public function sync(Base $base): void
    {
        $now = GameClock::now();
        $cycleId = $now->toDateTimeString();

        // Se já sincronizado neste exato segundo (mesmo ciclo), ignorar (PASSO 1)
        if (isset(self::$syncedThisCycle[$base->id]) && self::$syncedThisCycle[$base->id] === $cycleId) {
            return;
        }

        DB::transaction(function () use ($base, $now) {
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();
            if (!$lockedBase || !$lockedBase->recursos) return;

            $rates = $this->getRates($lockedBase);
            $calculated = $this->calculate($lockedBase->recursos, $now, $rates);

            // Write: Tabelas Recursos e Bases (Operação Atómica)
            $lockedBase->recursos->update([
                'suprimentos' => $calculated['suprimentos'],
                'combustivel' => $calculated['combustivel'],
                'municoes'    => $calculated['municoes'],
                'pessoal'     => $calculated['pessoal'],
                'metal'       => $calculated['metal'],
                'energia'     => $calculated['energia'],
                'storage_capacity' => $calculated['cap'],
                'updated_at'  => $now
            ]);

            $lockedBase->update(['ultimo_update' => $now]);
            
            // Sync instâncias
            $base->setRelation('recursos', $lockedBase->recursos);
            $base->ultimo_update = $now;
        });

        self::$syncedThisCycle[$base->id] = $cycleId;
    }

    public function calculate(Recurso $resource, $now = null, array $taxasMinuto = null): array
    {
        if (!$now) $now = GameClock::now();
        $base = $resource->base;

        if (!$taxasMinuto) $taxasMinuto = $this->getRates($base);

        $hqLevel = $base->qg_nivel ?? 1;
        $cap = app(EconomyService::class)->getStorageCapacity($hqLevel);
        
        $lastUpdateStr = $base->ultimo_update ?? $base->created_at;
        $lastUpdate = Carbon::parse($lastUpdateStr);
        
        $diff = max(0, $now->getTimestamp() - $lastUpdate->getTimestamp());
        $minutes = $diff / 60;

        $results = ['cap' => $cap];
        $types = ['suprimentos', 'combustivel', 'municoes', 'metal', 'energia', 'pessoal'];

        foreach ($types as $type) {
            $prod = ($taxasMinuto[$type] ?? 0) * $minutes;
            $current = (float) $resource->{$type};
            $results[$type] = min($cap, $current + $prod);
        }

        return $results;
    }

    public function getRates(Base $base): array
    {
        $taxas = ['suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0, 'metal' => 0, 'energia' => 0, 'pessoal' => 0];
        $edificios = $base->edificios()->with('type')->get();

        foreach ($edificios as $edificio) {
            $type = $edificio->type;
            if (!$type || !$type->production_type) continue;

            $prodType = $type->production_type;
            if (array_key_exists($prodType, $taxas)) {
                $taxas[$prodType] += app(EconomyService::class)->getBuildingProduction($type->base_production, $edificio->nivel);
            }
        }

        return $taxas;
    }
}
