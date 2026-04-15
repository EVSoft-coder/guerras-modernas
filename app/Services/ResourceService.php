<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Recurso;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Log;

/**
 * ResourceService - Doutrina de Persistência Atómica
 * Responsável estrito pelo cálculo e sincronização de recursos.
 */
class ResourceService
{
    /**
     * CÁLCULO PURO (Simulacro Determinístico)
     * Regra: amount + (rate_hour * (elapsed / 3600))
     * NÃO ALTERA A BASE DE DADOS.
     */
    public function calculate(Recurso $resource, $now = null, array $taxasMinuto = null): array
    {
        if (!$now) $now = Carbon::now();
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
        if ($now->greaterThan($lastUpdateCarbon)) {
            $elapsed = (float)$now->diffInSeconds($lastUpdateCarbon);
        }

        Log::info('RESOURCE_DEBUG', [
            'before' => $resource->suprimentos,
            'rate_min' => $taxasMinuto['suprimentos'] ?? 0,
            'last_update' => $lastUpdateCarbon->toDateTimeString(),
            'now' => $now->toDateTimeString(),
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
     * Deve ser chamado apenas em Build, Recruit ou Attack.
     */
    public function sync(Base $base): void
    {
        if (!$base->recursos) $base->load('recursos');
        $resource = $base->recursos;
        if (!$resource) return;

        $now = Carbon::now();
        $taxasMinuto = $this->getRates($base);
        $calculated = $this->calculate($resource, $now, $taxasMinuto);
        
        Log::info('RESOURCE_SYNC', $calculated);
        
        DB::transaction(function() use ($base, $resource, $calculated, $now) {
            // Write 1: Tabela Recursos (Fonte da Verdade)
            $resource->update([
                'suprimentos' => $calculated['suprimentos'],
                'combustivel' => $calculated['combustivel'],
                'municoes'    => $calculated['municoes'],
                'pessoal'     => $calculated['pessoal'],
                'metal'       => $calculated['metal'],
                'energia'     => $calculated['energia'],
                'updated_at'  => $now
            ]);

            // Write 2: Tabela Bases (Checkpoints Táticos)
            $base->update([
                'ultimo_update' => $now
            ]);
        });

        // Mutar instâncias para evitar stale data no mesmo request
        $base->ultimo_update = $now;
        $resource->setRawAttributes(array_merge($resource->getAttributes(), $calculated, ['updated_at' => $now]), true);
    }
    
    /**
     * Auxiliar interno para obter taxas sem depender de GameService
     */
    private function getRates(Base $base): array
    {
        $levels = [
            'mina_metal' => (int)($base->edificios()->where('tipo', 'mina_metal')->first()?->nivel ?? 0),
            'central_energia' => (int)($base->edificios()->where('tipo', 'central_energia')->first()?->nivel ?? 0),
            'mina_suprimentos' => (int)($base->edificios()->where('tipo', 'mina_suprimentos')->first()?->nivel ?? 0),
            'refinaria' => (int)($base->edificios()->where('tipo', 'refinaria')->first()?->nivel ?? 0),
            'fabrica_municoes' => (int)($base->edificios()->where('tipo', 'fabrica_municoes')->first()?->nivel ?? 0),
            'posto_recrutamento' => (int)($base->edificios()->where('tipo', 'posto_recrutamento')->first()?->nivel ?? 0),
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
