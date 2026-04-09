<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Base;
use App\Models\Recurso;
use App\Models\Construcao;
use App\Models\Edificio;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProcessarCron extends Command
{
    protected $signature = 'cron:processar';
    protected $description = 'Processa a produção de recursos e finaliza construções/treinos';

    // Taxas Base de Produção (pode ser movido para config/game.php depois)
    protected $taxasBase = [
        'mina suprimentos' => ['suprimentos' => 50],
        'refinaria' => ['combustivel' => 40],
        'fabrica municoes' => ['municoes' => 20],
        'posto recrutamento' => ['pessoal' => 10],
    ];

    public function handle()
    {
        $this->info("Iniciando processamento cron em " . now());

        // 1. Finalizar Construções que já terminaram
        $concluidas = Construcao::where('completado_em', '<=', now())->get();
        foreach ($concluidas as $c) {
            DB::transaction(function() use ($c) {
                // Atualizar ou criar o edifício na base
                $edif = Edificio::where('base_id', $c->base_id)
                                ->where('tipo', $c->edificio_tipo)
                                ->first();
                
                if ($edif) {
                    $edif->update(['nivel' => $c->nivel_destino]);
                } else {
                    Edificio::create([
                        'base_id' => $c->base_id,
                        'tipo' => $c->edificio_tipo,
                        'nivel' => $c->nivel_destino
                    ]);
                }
                
                // Remover da fila
                $c->delete();
                $this->info("Construção finalizada: {$c->edificio_tipo} Nível {$c->nivel_destino}");
            });
        }

        // 2. Processar Produção de Recursos para todas as bases
        $bases = Base::all();
        foreach ($bases as $base) {
            $this->processarRecursos($base);
        }

        $this->info("Processamento concluído.");
    }

    private function processarRecursos(Base $base)
    {
        $ultimoUpdate = $base->ultimo_update ? Carbon::parse($base->ultimo_update) : $base->created_at;
        $agora = now();
        $diffMinutos = $ultimoUpdate->diffInMinutes($agora);

        if ($diffMinutos <= 0) return;

        $recursos = Recurso::where('base_id', $base->id)->first();
        if (!$recursos) return;

        // Calcular taxas por edifício
        $edificios = Edificio::where('base_id', $base->id)->get();
        
        $ganho = [
            'suprimentos' => 0,
            'combustivel' => 0,
            'municoes' => 0,
            'pessoal' => 0
        ];

        foreach ($edificios as $ed) {
            if (isset($this->taxasBase[$ed->tipo])) {
                foreach ($this->taxasBase[$ed->tipo] as $res => $valorBase) {
                    // Lógica simples: Produção = ValorBase * Nível * Tempo
                    // Ex: Nível 2 produz o dobro do Nível 1
                    $producaoPorMinuto = ($valorBase * $ed->nivel) / 60;
                    $ganho[$res] += $producaoPorMinuto * $diffMinutos;
                }
            }
        }

        // Atualizar recursos
        $recursos->increment('suprimentos', $ganho['suprimentos']);
        $recursos->increment('combustivel', $ganho['combustivel']);
        $recursos->increment('municoes', $ganho['municoes']);
        $recursos->increment('pessoal', $ganho['pessoal']);

        // Atualizar timestamp da base
        $base->update(['ultimo_update' => $agora]);
    }
}
