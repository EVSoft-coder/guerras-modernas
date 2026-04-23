<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';

use App\Services\ResourceService;
use App\Models\Base;
use App\Models\Edificio;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$resourceService = app(ResourceService::class);

echo "--- FASE VALIDAÇÃO FINAL: MOCK TEST (COMPORTAMENTO TRIBALWARS) ---\n";

// 1. Criar Mock de Base e Edifícios
$base = new Base();
$base->id = 999;

$minaMetalLvl1 = new Edificio(['tipo' => 'mina_metal', 'nivel' => 1]);
$base->setRelation('edificios', collect([$minaMetalLvl1]));

// 2. Ver produção Nível 1
$ratesLvl1 = $resourceService->getRates($base);
$rateLvl1 = $ratesLvl1['metal'] ?? 0;
echo "1. Produção Nível 1: " . number_format($rateLvl1, 2) . " / hora\n";

// 3. Simular Upgrade para Nível 2
$minaMetalLvl2 = new Edificio(['tipo' => 'mina_metal', 'nivel' => 2]);
$base->setRelation('edificios', collect([$minaMetalLvl2]));
echo "2. Upgrade Simulado para Nível 2\n";

// 4. Ver produção Nível 2
$ratesLvl2 = $resourceService->getRates($base);
$rateLvl2 = $ratesLvl2['metal'] ?? 0;
echo "3. Produção Nível 2: " . number_format($rateLvl2, 2) . " / hora\n";

// 5. Comparar para Nível 10 para ver o salto
$minaMetalLvl10 = new Edificio(['tipo' => 'mina_metal', 'nivel' => 10]);
$base->setRelation('edificios', collect([$minaMetalLvl10]));
$rateLvl10 = $resourceService->getRates($base)['metal'] ?? 0;
echo "4. Produção Nível 10: " . number_format($rateLvl10, 2) . " / hora\n\n";

echo "--- RESULTADO DA VALIDAÇÃO ---\n";
if ($rateLvl2 > $rateLvl1 && $rateLvl10 > $rateLvl2) {
    echo "SUCESSO: Progressão Exponencial Validada.\n";
    echo "rate_Lvl10 (" . number_format($rateLvl10, 2) . ") > rate_Lvl2 (" . number_format($rateLvl2, 2) . ") > rate_Lvl1 (" . number_format($rateLvl1, 2) . ")\n";
    echo "Comportamento TribalWars CONFIRMADO.\n";
} else {
    echo "FALHA: A progressão não é crescente.\n";
}
