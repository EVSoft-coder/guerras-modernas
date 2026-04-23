<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';

use App\Models\Edificio;
use App\Domain\Building\BuildingType;
use Illuminate\Support\Facades\DB;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- FASE AUDITORIA: COMPATIBILIDADE DE NOMES ---\n";

$buildings = DB::table('edificios')->select('tipo')->distinct()->get();

foreach ($buildings as $b) {
    $normalized = BuildingType::normalize($b->tipo);
    if ($b->tipo !== $normalized) {
        echo "DETETADO: '{$b->tipo}' deve ser '{$normalized}'\n";
    } else {
        echo "OK: '{$b->tipo}' já está normalizado.\n";
    }
}

echo "\n--- VERIFICAÇÃO DE PRODUÇÃO (CONFIG) ---\n";
$configProducao = config('game.production');

foreach ($buildings as $b) {
    $normalized = BuildingType::normalize($b->tipo);
    if (isset($configProducao[$normalized])) {
        echo "VÍNCULO: '{$normalized}' ligado corretamente a '{$configProducao[$normalized]['resource']}'\n";
    } else {
        // HQ e Muralha não produzem nada, é normal
        if (in_array($normalized, ['hq', 'muralha', 'posto_recrutamento', 'quartel', 'aerodromo', 'radar_estrategico', 'centro_pesquisa', 'parlamento'])) {
            echo "INFO: '{$normalized}' é estrutura de suporte (sem produção direta).\n";
        } else {
            echo "AVISO: '{$normalized}' não tem regras de produção em config/game.php\n";
        }
    }
}
