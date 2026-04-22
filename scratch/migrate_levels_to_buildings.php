<?php

use App\Models\Base;
use App\Models\Edificio;
use App\Domain\Building\BuildingType;
use Illuminate\Support\Facades\DB;

require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

DB::transaction(function() {
    $bases = Base::all();
    echo "Processing " . $bases->count() . " bases...\n";

    foreach ($bases as $base) {
        // HQ
        $hq = $base->edificios()->where('tipo', BuildingType::HQ)->first();
        if (!$hq) {
            $base->edificios()->create([
                'tipo' => BuildingType::HQ,
                'nivel' => $base->qg_nivel ?? 1,
                'pos_x' => 400, // Default HQ pos from buildingLayout.ts
                'pos_y' => 300,
            ]);
            echo "Base {$base->id}: Created HQ level {$base->qg_nivel}\n";
        } else {
            $hq->update(['nivel' => max($hq->nivel, $base->qg_nivel)]);
        }

        // Muralha
        $muralha = $base->edificios()->where('tipo', BuildingType::MURALHA)->first();
        if (!$muralha) {
            $base->edificios()->create([
                'tipo' => BuildingType::MURALHA,
                'nivel' => $base->muralha_nivel ?? 0,
                'pos_x' => 400, // Default Wall pos
                'pos_y' => 530,
            ]);
            echo "Base {$base->id}: Created Muralha level {$base->muralha_nivel}\n";
        } else {
            $muralha->update(['nivel' => max($muralha->nivel, $base->muralha_nivel)]);
        }
    }
});

echo "DATA MIGRATION COMPLETED.\n";
