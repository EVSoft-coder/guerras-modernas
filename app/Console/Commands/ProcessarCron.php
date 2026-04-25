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
        $startTime = microtime(true);
        $this->info("🚀 [CRONOS] Iniciando Ciclo de Operação Determinístico em " . now());

        $npcService = new \App\Services\NpcService();
        $npcGrown = $npcService->growNpcVillages();
        $this->info("🛡️ [NPC] $npcGrown aldeias bárbaras evoluídas.");

        // Processar todas as bases em chunks para evitar estouro de memória
        \App\Models\Base::chunk(100, function ($bases) {
            foreach ($bases as $base) {
                try {
                    // Motor Soberano: Processa Recursos, Construções, Treinos e Movimentos
                    \App\Services\GameEngine::process($base);
                } catch (\Exception $e) {
                    Log::error("❌ [CRONOS_FAIL] Base {$base->id}: " . $e->getMessage());
                    $this->error("Falha na Base {$base->id}");
                }
            }
        });

        $endTime = microtime(true);
        $duration = round($endTime - $startTime, 2);
        $this->info("✅ [CRONOS] Ciclo concluído em {$duration}s.");
    }

}
