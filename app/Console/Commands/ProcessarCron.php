<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GameService;
use Illuminate\Support\Facades\Log;

class ProcessarCron extends Command
{
    protected $signature = 'cron:processar';
    protected $description = 'Processa a produção de recursos e finaliza construções/treinos';


    public function handle()
    {
        $this->info("Iniciando Ciclo de Operação em " . now());

        $gameService = new GameService();
        $bases = \App\Models\Base::all();

        foreach ($bases as $base) {
            try {
                // Orquestração Unificada (Fase 4 - Passo 3)
                $gameService->tickResources($base);

                $this->info("Operação concluída na Base [ID: {$base->id}].");
            } catch (\Exception $e) {
                Log::error("FALHA CRÍTICA NO CRON (Base {$base->id}): " . $e->getMessage());
                $this->error("Interrupção técnica na Base {$base->id}");
            }
        }

        $this->info("Ciclo de Operação concluído com sucesso.");
    }

}
