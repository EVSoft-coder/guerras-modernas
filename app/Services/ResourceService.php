<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Recurso;
use App\Services\TimeService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * ResourceService - Doutrina de Persistência Atómica.
 * Responsável estrito pelo cálculo e sincronização de recursos.
 * Fase 2: Harden Resource Service (uso de locks e transações).
 */
class ResourceService
{
    private TimeService $timeService;
    protected static $syncedBases = [];

    public function __construct(?TimeService $timeService = null)
    {
        $this->timeService = $timeService ?? new TimeService();
    }

    /**
     * CÁLCULO PURO (Simulacro Determinístico)
     * Regra: amount + (rate_hour * (elapsed / 3600))
     * NÃO ALTERA A BASE DE DADOS.
     */
    public function calculate(Recurso $resource, $now = null, array $taxasMinuto = null): array
    {
        if (!$now) $now = $this->timeService->now();
        $base = $resource->base;

        if (!$taxasMinuto) {
            $taxasMinuto = [
                'suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0, 
                'metal' => 0, 'energia' => 0, 'pessoal' => 0
            ];
        }

        $cap = (int)($resource->storage_capacity ?? 10000);
        $lastUpdate = $base->ultimo_update ?? $base->created_at;
        $lastUpdateCarbon = Carbon::parse($lastUpdate);
        
        $elapsed = 0;
        $diff = (float)$now->getTimestamp() - (float)$lastUpdateCarbon->getTimestamp();
        if ($diff > 0) {
            $elapsed = $diff;
        }

        Log::channel('game')->info('[RESOURCE_CALC]', [
            'base_id' => $base->id,
            'before' => $resource->suprimentos,
            'rate_min' => $taxasMinuto['suprimentos'] ?? 0,
            'elapsed' => $elapsed
        ]);
        
        $calcFunc = function($baseAmount, $ratePerMin) use ($elapsed) {
            $ratePerHour = $ratePerMin * 60;
            return $baseAmount + ($ratePerHour * ($elapsed / 3600));
        };

        return [
            'suprimentos' => min($cap, max(0, $calcFunc((float)$resource->suprimentos, $taxasMinuto['suprimentos'] ?? 0))),
            'combustivel' => min($cap, max(0, $calcFunc((float)$resource->combustivel, $taxasMinuto['combustivel'] ?? 0))),
            'municoes'    => min($cap, max(0, $calcFunc((float)$resource->municoes, $taxasMinuto['municoes'] ?? 0))),
            'metal'       => min($cap, max(0, $calcFunc((float)$resource->metal, $taxasMinuto['metal'] ?? 0))),
            'energia'     => min($cap, max(0, $calcFunc((float)$resource->energia, $taxasMinuto['energia'] ?? 0))),
            'pessoal'     => (float)$resource->pessoal,
            'cap'         => $cap,
            'last_update' => $now->toDateTimeString(),
        ];
    }

    /**
     * SINCRONIZAÇÃO ATÓMICA (Único ponto de escrita)
     */
    public function sync(Base $base): void
    {
        if (in_array($base->id, self::$syncedBases)) return;

        DB::transaction(function() use ($base) {
            // Fase 2: Lock for Update
            $lockedBase = Base::where('id', $base->id)->lockForUpdate()->with('recursos')->first();
            if (!$lockedBase || !$lockedBase->recursos) return;

            $now = $this->timeService->now();
            $taxasMinuto = $this->getRates($lockedBase);
            $calculated = $this->calculate($lockedBase->recursos, $now, $taxasMinuto);
            
            Log::channel('game')->info('[RESOURCE_SYNC]', [
                'base_id' => $base->id,
                'calculated' => $calculated
            ]);

            Log::channel('game')->info('[RESOURCE_SYNC] Pre-Update', [
                'base_id' => $base->id,
                'db_values' => [
                    'sup' => $lockedBase->recursos->suprimentos,
                    'metal' => $lockedBase->recursos->metal
                ]
            ]);

            // Write 1: Tabela Recursos
            $lockedBase->recursos->update([
                'suprimentos' => $calculated['suprimentos'],
                'combustivel' => $calculated['combustivel'],
                'municoes'    => $calculated['municoes'],
                'pessoal'     => $calculated['pessoal'],
                'metal'       => $calculated['metal'],
                'energia'     => $calculated['energia'],
                'updated_at'  => $now
            ]);

            // Write 2: Tabela Bases
            $lockedBase->update([
                'ultimo_update' => $now
            ]);

            Log::channel('game')->info('[RESOURCE_SYNC] Post-Update', [
                'base_id' => $base->id,
                'new_values' => $calculated
            ]);

            // Atualizar instâncias passadas por referência (se necessário)
            $base->setRelation('recursos', $lockedBase->recursos);
            $base->ultimo_update = $now;
        });

        self::$syncedBases[] = $base->id;
    }
    
    public function getRates(Base $base): array
    {
        $taxas = [
            'suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0, 
            'metal' => 0, 'energia' => 0, 'pessoal' => 0
        ];

        // Carregar edifícios com seus tipos para cálculo normalizado (Passo 2)
        $edificios = $base->edificios()->with('type')->get();

        foreach ($edificios as $edificio) {
            $type = $edificio->type;
            if (!$type || !$type->production_type) continue;

            $prodType = $type->production_type;
            if (array_key_exists($prodType, $taxas)) {
                // FÓRMULA PASSO 2: produção = (base_production * level)
                $taxas[$prodType] += ($type->base_production * $edificio->nivel);
            }
        }

        return $taxas;
    }
}
