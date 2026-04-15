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
    public function calculate(Recurso $resource, $now = null): array
    {
        if (!$now) $now = Carbon::now();
        $base = $resource->base;

        if (!$base) {
            return [
                'suprimentos' => $resource->suprimentos, 
                'combustivel' => $resource->combustivel, 
                'municoes' => $resource->municoes,
                'pessoal' => $resource->pessoal, 
                'metal' => $resource->metal, 
                'energia' => $resource->energia, 
                'cap' => 10000,
            ];
        }

        $cap = (int)($resource->cap ?? 10000);
        $lastUpdate = $base->ultimo_update ?? $base->created_at;
        $lastUpdateCarbon = Carbon::parse($lastUpdate);
        
        $elapsed = 0;
        if ($now->greaterThan($lastUpdateCarbon)) {
            $elapsed = (float)$now->diffInSeconds($lastUpdateCarbon);
        }

        // Obter taxas (GameService centraliza as regras de edifícios)
        $gameService = new GameService();
        $taxasMinuto = $gameService->obterTaxasProducao($base);
        
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
        $calculated = $this->calculate($resource, $now);
        
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
}
