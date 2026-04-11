<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Ataque;
use App\Services\CombatService;
use Illuminate\Support\Facades\DB;

class ProcessarBatalhas extends Command
{
    protected $signature = 'game:processar-batalhas';
    protected $description = 'Processa os ataques e regresso de tropas em background';

    public function handle()
    {
        $ataques = Ataque::where('processado', 0)
            ->where('chegada_em', '<=', now())
            ->get();

        if ($ataques->isEmpty()) {
            return;
        }

        $combatService = app(CombatService::class);

        foreach ($ataques as $atq) {
            try {
                if ($atq->tipo === 'retorno') {
                    $combatService->finalizarRetorno($atq);
                    $this->info("REGRESSO: Tropas e saque retornaram à base.");
                } else {
                    $combatService->resolverCombate($atq);
                    $this->info("COMBATE: Operação militar processada ativamente.");
                }
            } catch (\Exception $e) {
                $this->error("FALHA CRÍTICA [ATQ: {$atq->id}]: " . $e->getMessage());
                // Marcar como processado para evitar loops infinitos de erro
                $atq->update(['processado' => true]);
            }
        }
    }
}
