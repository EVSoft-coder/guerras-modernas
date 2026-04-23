<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Base;
use App\Domain\Building\BuildingType;

class FixVillages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'game:fix-villages';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Garante que todas as bases tenham a infraestrutura mínima de Nível 1';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $bases = Base::all();
        $fixedCount = 0;

        $this->info("Iniciando auditoria de infraestrutura em " . $bases->count() . " bases...");

        foreach ($bases as $base) {
            if ($base->edificios()->count() === 0) {
                $this->warn("Base #{$base->id} ({$base->nome}) sem edifícios detetada. Aplicando Bootstrap...");

                $base->edificios()->createMany([
                    ['tipo' => BuildingType::HQ, 'nivel' => 1, 'pos_x' => 400, 'pos_y' => 300],
                    ['tipo' => BuildingType::MURALHA, 'nivel' => 1, 'pos_x' => 400, 'pos_y' => 530],
                    ['tipo' => BuildingType::MINA_SUPRIMENTOS, 'nivel' => 1, 'pos_x' => 268, 'pos_y' => 185],
                    ['tipo' => BuildingType::MINA_METAL, 'nivel' => 1, 'pos_x' => 532, 'pos_y' => 185],
                    ['tipo' => BuildingType::REFINARIA, 'nivel' => 1, 'pos_x' => 532, 'pos_y' => 415],
                    ['tipo' => BuildingType::CENTRAL_ENERGIA, 'nivel' => 1, 'pos_x' => 400, 'pos_y' => 70],
                    ['tipo' => BuildingType::FABRICA_MUNICOES, 'nivel' => 1, 'pos_x' => 135, 'pos_y' => 300],
                    ['tipo' => BuildingType::HOUSING, 'nivel' => 1, 'pos_x' => 268, 'pos_y' => 415],
                    ['tipo' => BuildingType::POSTO_RECRUTAMENTO, 'nivel' => 1, 'pos_x' => 665, 'pos_y' => 300],
                ]);

                $fixedCount++;
            }
        }

        if ($fixedCount > 0) {
            $this->success("Sucesso: $fixedCount bases foram reparadas e agora possuem infraestrutura mínima.");
        } else {
            $this->info("Auditoria concluída. Todas as bases já possuem infraestrutura.");
        }
    }
}
