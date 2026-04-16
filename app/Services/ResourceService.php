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

        $cap = (int)($resource->cap ?? 10000);
        $lastUpdate = $base->ultimo_update ?? $base->created_at;
        $lastUpdateCarbon = Carbon::parse($lastUpdate);
        
        $elapsed = 0;
        $diff = (float)$now->getTimestamp() - (float)$lastUpdateCarbon->getTimestamp();
        if ($diff > 0) {
            $elapsed = $diff;
        }

        Log::info('[RESOURCE_CALC]', [
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
            
            Log::info('[RESOURCE_SYNC]', [
                'base_id' => $base->id,
                'calculated' => $calculated
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

            // Atualizar instâncias passadas por referência (se necessário)
            $base->setRelation('recursos', $lockedBase->recursos);
            $base->ultimo_update = $now;
        });

        self::$syncedBases[] = $base->id;
    }
    
    private function getRates(Base $base): array
    {
        $edificios = $base->edificios;
        $getLevel = function($type) use ($edificios) {
            return (int)($edificios->filter(function($e) use ($type) {
                return \App\Domain\Building\BuildingType::normalize($e->tipo) === $type;
            })->first()?->nivel ?? 0);
        };

        $levels = [
            'mina_metal' => $getLevel(\App\Domain\Building\BuildingType::MINA_METAL),
            'central_energia' => $getLevel(\App\Domain\Building\BuildingType::CENTRAL_ENERGIA),
            'mina_suprimentos' => $getLevel(\App\Domain\Building\BuildingType::MINA_SUPRIMENTOS),
            'refinaria' => $getLevel(\App\Domain\Building\BuildingType::REFINARIA),
            'fabrica_municoes' => $getLevel(\App\Domain\Building\BuildingType::FABRICA_MUNICOES),
            'posto_recrutamento' => $getLevel(\App\Domain\Building\BuildingType::POSTO_RECRUTAMENTO),
        ];

        return [
            'metal' => \App\Domain\Economy\EconomyRules::calculateProductionPerMinute('metal', $levels['mina_metal']),
            'energia' => \App\Domain\Economy\EconomyRules::calculateProductionPerMinute('energia', $levels['central_energia']),
            'suprimentos' => \App\Domain\Economy\EconomyRules::calculateProductionPerMinute('suprimentos', $levels['mina_suprimentos']),
            'combustivel' => \App\Domain\Economy\EconomyRules::calculateProductionPerMinute('combustivel', $levels['refinaria']),
            'municoes' => \App\Domain\Economy\EconomyRules::calculateProductionPerMinute('municoes', $levels['fabrica_municoes']),
            'pessoal' => \App\Domain\Economy\EconomyRules::calculateProductionPerMinute('pessoal', $levels['posto_recrutamento']),
        ];
    }
}
