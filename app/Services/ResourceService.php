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
    public function calculate(Base $base, $now = null): array
    {
        if (!$now) $now = Carbon::now();

        if (!$base->relationLoaded('recursos')) {
            $base->load('recursos');
        }
        $rec = $base->recursos;

        if (!$rec) {
            return [
                'suprimentos' => 0, 'combustivel' => 0, 'municoes' => 0,
                'pessoal' => 0, 'metal' => 0, 'energia' => 0, 'cap' => 10000,
            ];
        }

        $cap = (int)($rec->cap ?? 10000);
        $lastUpdate = $base->ultimo_update ?? $base->created_at;
        $lastUpdateCarbon = Carbon::parse($lastUpdate);
        
        $elapsed = 0;
        if ($now->greaterThan($lastUpdateCarbon)) {
            $elapsed = (float)$now->diffInSeconds($lastUpdateCarbon);
        } else if ($now->lessThan($lastUpdateCarbon)) {
            // Guardrail anti-resets: Se o clock do servidor recuar, mantemos o saldo do checkpoint.
            Log::warning('RESOURCE_CLOCK_DRIFT_DETECTED', [
                'base_id' => $base->id,
                'last_update' => $lastUpdateCarbon->toDateTimeString(),
                'now' => $now->toDateTimeString()
            ]);
            $elapsed = 0;
        }

        // Obter taxas (GameService ainda centraliza as regras de edifícios)
        $gameService = new GameService();
        $taxasMinuto = $gameService->obterTaxasProducao($base);
        
        Log::info('RESOURCE_CALC_START', [
            'base_id' => $base->id,
            'elapsed_sec' => $elapsed,
            'last_check' => $lastUpdateCarbon->toDateTimeString()
        ]);
        $calcFunc = function($baseAmount, $ratePerMin) use ($elapsed) {
            $ratePerHour = $ratePerMin * 60;
            return $baseAmount + ($ratePerHour * ($elapsed / 3600));
        };

        $result = [
            'suprimentos' => min($cap, max(0, $calcFunc((float)$rec->suprimentos, $taxasMinuto['suprimentos'] ?? 0))),
            'combustivel' => min($cap, max(0, $calcFunc((float)$rec->combustivel, $taxasMinuto['combustivel'] ?? 0))),
            'municoes'    => min($cap, max(0, $calcFunc((float)$rec->municoes, $taxasMinuto['municoes'] ?? 0))),
            'metal'       => min($cap, max(0, $calcFunc((float)$rec->metal, $taxasMinuto['metal'] ?? 0))),
            'energia'     => min($cap, max(0, $calcFunc((float)$rec->energia, $taxasMinuto['energia'] ?? 0))),
            'pessoal'     => (float)$rec->pessoal,
            'cap'         => $cap,
            'last_update' => $now->toDateTimeString(),
        ];

        Log::info('RESOURCE_CALC_RESULT', [
            'base_id' => $base->id,
            'metal' => $result['metal'],
            'energia' => $result['energia']
        ]);

        return $result;
    }

    /**
     * SINCRONIZAÇÃO ATÓMICA (Único ponto de escrita)
     * Deve ser chamado apenas em Build, Recruit ou Attack.
     */
    public function syncVillageResources(Base $base): void
    {
        $now = Carbon::now();
        $calculated = $this->calculate($base, $now);
        
        DB::transaction(function() use ($base, $calculated, $now) {
            // Write 1: Tabela Recursos (Legacy)
            DB::table('recursos')
                ->where('base_id', $base->id)
                ->update([
                    'suprimentos' => $calculated['suprimentos'],
                    'combustivel' => $calculated['combustivel'],
                    'municoes'    => $calculated['municoes'],
                    'pessoal'     => $calculated['pessoal'],
                    'metal'       => $calculated['metal'],
                    'energia'     => $calculated['energia'],
                    'updated_at'  => $now
                ]);

            // Write 2: Tabela Bases (Checkpoints Rápidos)
            DB::table('bases')->where('id', $base->id)->update([
                'ultimo_update' => $now,
                'recursos_metal' => $calculated['metal'],
                'recursos_energia' => $calculated['energia'],
                'recursos_comida' => $calculated['municoes'],
            ]);
        });

        // Mutar instância para evitar stale data no mesmo request
        $base->ultimo_update = $now;
        if ($base->relationLoaded('recursos') && $base->recursos) {
            $base->recursos->setRawAttributes(array_merge($calculated, ['updated_at' => $now]), true);
        }
    }
}
