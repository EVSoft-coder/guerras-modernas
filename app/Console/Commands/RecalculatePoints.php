<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Base;
use App\Services\PointsService;

class RecalculatePoints extends Command
{
    protected $signature = 'game:recalculate-points';
    protected $description = 'Recalcula os pontos de todas as bases e jogadores.';

    public function handle()
    {
        $pointsService = app(PointsService::class);
        $bases = Base::all();

        $this->info("Recalculando pontos para " . $bases->count() . " bases...");

        foreach ($bases as $base) {
            $pointsService->recalculateBasePoints($base);
        }

        $this->success("Recálculo concluído!");
    }
}
