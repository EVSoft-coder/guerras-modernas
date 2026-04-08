<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Ataque;
use App\Services\CombatService;
use Illuminate\Support\Facades\DB;

class ProcessarBatalhas extends Command
{
    protected $signature = 'game:processar-batalhas';
    protected $description = 'Processa os ataques que chegaram ao destino em background';

    public function handle()
    {
        $ataques = Ataque::with(['origem.jogador', 'destino.tropas', 'destino.recursos'])
            ->where('processado', 0)
            ->where('chegada_em', '<=', now())
            ->get();

        if ($ataques->isEmpty()) {
            return;
        }

        $combatService = new CombatService();

        foreach ($ataques as $atq) {
            DB::transaction(function () use ($atq, $combatService) {
                if (!$atq->origem || !$atq->destino) {
                    Ataque::where('id', $atq->id)->update(['processado' => 1]);
                    return;
                }

                // Resolver a batalha usando o serviço centralizado
                $combatService->resolver(
                    $atq->tropas, 
                    $atq->destino, 
                    $atq->origem->jogador_id, 
                    $atq->tipo,
                    $atq->origem
                );

                // Marcar como processado
                Ataque::where('id', $atq->id)->update(['processado' => 1]);
            });

            $this->info("Operação Militar [ID: {$atq->id}] processada com sucesso.");
        }
    }
}
