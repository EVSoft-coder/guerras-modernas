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
                // 1. Sincronizar Recursos (Persistência Passiva)
                $gameService->syncResources($base);

                // 2. Processar Fila de Construção e Treino
                $gameService->processarFilas($base);

                $this->info("Base [ID: {$base->id}] processada.");
            } catch (\Exception $e) {
                Log::error("Erro no Cron para Base {$base->id}: " . $e->getMessage());
                $this->error("Falha na Base {$base->id}");
            }
        }

        $this->info("Ciclo de Operação concluído com sucesso.");
    }

}
