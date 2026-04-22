<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Recurso;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * ResourceService - Escala Real (PASSO 3 — FASE HARDEN 3).
 * Sincronização inteligente baseada em estado, não apenas tempo.
 */
class ResourceService
{
    private TimeService $timeService;

    public function __construct(?TimeService $timeService = null)
    {
        $this->timeService = $timeService ?? new TimeService();
    }

    public function calculateResources(Base $base)
    {
        if (!$base->recursos) return [];
        return $this->calculate($base->recursos);
    }
    /**
     * Sincroniza a base com o tempo real se houver mudança de estado.
     */
    public function sync(Base $base): void
    {
        $now = GameClock::now();

        DB::transaction(function () use ($base, $now) {
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->first();
            if (!$lockedBase || !$lockedBase->recursos) return;

            $rates = $this->getRates($lockedBase);
            $calculated = $this->calculate($lockedBase->recursos, $now, $rates);

            // PASSO 6 — LOGGING: Registar diffs (Harden 3)
            $before = $lockedBase->recursos->only(['suprimentos', 'combustivel', 'municoes']);

            // PASSO 3 — VERIFICAÇÃO POR ESTADO (Harden 3)
            // Só escrevemos se houver mudança tática real nos valores ou se houver recalque de tempo significativo
            if (!$this->hasStateChanged($lockedBase->recursos, $calculated)) {
                return;
            }

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
            
            Log::channel('game')->info("[RESOURCE_DIFF] Base #{$base->id}", [
                'before' => $before,
                'after' => collect($calculated)->only(['suprimentos', 'combustivel', 'municoes'])->toArray()
            ]);

            // Sync instâncias
            $base->setRelation('recursos', $lockedBase->recursos);
            $base->ultimo_update = $now;
        }, 5);
    }

    private function hasStateChanged(Recurso $current, array $calculated): bool
    {
        // Mudança se a diferença for > 0.1 em qualquer recurso (evitar floats irrelevantes)
        foreach (['suprimentos', 'combustivel', 'municoes', 'metal', 'energia', 'pessoal'] as $key) {
            if (abs((float)$current->{$key} - (float)$calculated[$key]) > 0.1) return true;
        }
        return false;
    }

    public function calculate(Recurso $resource, $now = null, array $taxasHora = null)
    {
        if (!$now) $now = GameClock::now();
        $base = $resource->base;

        if (!$taxasHora) $taxasHora = $this->getRates($base);

        $hqLevel = app(GameService::class)->obterNivelEdificio($base, \App\Domain\Building\BuildingType::HQ) ?: 1;
        $cap = app(EconomyService::class)->getStorageCapacity($hqLevel);
        
        // FASE CORREÇÃO: Uso estrito de ultimo_update (SSOT Temporal)
        if (!$base->ultimo_update) {
            \Illuminate\Support\Facades\Log::channel('game')->error("[ECONOMY_ERROR] ultimo_update NULL na base #{$base->id}");
            $lastUpdate = $now->copy()->subMinutes(1); // Fallback de emergência de 1 min apenas para não travar, mas loga erro
        } else {
            $lastUpdate = Carbon::parse($base->ultimo_update);
        }
        
        // Delta em segundos para máxima precisão
        $deltaSeconds = max(0, $now->getTimestamp() - $lastUpdate->getTimestamp());
        $hours = $deltaSeconds / 3600;

        $results = ['cap' => $cap];
        $types = ['suprimentos', 'combustivel', 'municoes', 'metal', 'energia', 'pessoal'];

        foreach ($types as $type) {
            // Produção = Taxa Horária * Fração de Hora
            $rate = $taxasHora[$type] ?? 0;
            $prod = $rate * $hours;
            $current = (float) $resource->{$type};
            $resultado = (int) min($cap, $current + $prod);
            
            // FASE DEBUG PROFUNDO — LOG TÁTICO
            \Illuminate\Support\Facades\Log::channel('game')->info("[ECONOMY_CALC] {$type}", [
                'delta_hours' => $hours,
                'rate_hour' => $rate,
                'current' => $current,
                'calc_final' => $resultado,
                'cap' => $cap
            ]);

            $results[$type] = $resultado;
        }

        // FASE DEBUG PROFUNDO — ECONOMIA (OUTPUT CONTROLADO)
        return response()->json([
            'delta_seconds' => $deltaSeconds,
            'rates' => [
                'suprimentos' => $taxasHora['suprimentos'] ?? 0,
                'combustivel' => $taxasHora['combustivel'] ?? 0,
                'municoes' => $taxasHora['municoes'] ?? 0,
                'metal' => $taxasHora['metal'] ?? 0,
                'energia' => $taxasHora['energia'] ?? 0,
                'pessoal' => $taxasHora['pessoal'] ?? 0,
            ],
            'calculated' => $results,
            'hours' => $hours
        ]);
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
