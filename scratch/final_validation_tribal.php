<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';

use App\Services\ResourceService;
use App\Models\Base;
use App\Models\Edificio;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$resourceService = app(ResourceService::class);

// 1. Encontrar uma base de teste
$base = Base::first();
if (!$base) {
    echo "ERRO: Nenhuma base encontrada para teste.\n";
    exit(1);
}

echo "--- FASE VALIDAÇÃO FINAL: COMPORTAMENTO TRIBALWARS ---\n";
echo "Base: {$base->nome} (#{$base->id})\n\n";

// 2. Ver produção atual
$ratesAntigos = $resourceService->getRates($base);
$rateMetalAntigo = $ratesAntigos['metal'] ?? 0;
echo "1. Produção Atual de Metal: " . number_format($rateMetalAntigo, 2) . " / hora\n";

// 3. Simular Upgrade de Mina de Metal
$minaMetal = $base->edificios()->where('tipo', 'mina_metal')->first();
if (!$minaMetal) {
    // Criar se não existir
    $minaMetal = $base->edificios()->create(['tipo' => 'mina_metal', 'nivel' => 1, 'pos_x' => 0, 'pos_y' => 0]);
    echo "Nota: Mina de Metal não existia, criada no Nível 1.\n";
}

$nivelAntigo = $minaMetal->nivel;
$minaMetal->nivel += 1;
$minaMetal->save();

echo "2. Upgrade Realizado: Mina de Metal Nível $nivelAntigo -> Nível {$minaMetal->nivel}\n";

// 4. Refresh e Comparar Rate
// Recarregar a relação de edifícios para garantir que o ResourceService veja a mudança
$base->load('edificios');
$ratesNovos = $resourceService->getRates($base);
$rateMetalNovo = $ratesNovos['metal'] ?? 0;

echo "3. Nova Produção de Metal: " . number_format($rateMetalNovo, 2) . " / hora\n\n";

echo "--- RESULTADO DA VALIDAÇÃO ---\n";
if ($rateMetalNovo > $rateMetalAntigo) {
    echo "SUCESSO: rate_novo (" . number_format($rateMetalNovo, 2) . ") > rate_antigo (" . number_format($rateMetalAntigo, 2) . ")\n";
    echo "Comportamento TribalWars CONFIRMADO.\n";
} else {
    echo "FALHA: O rate não aumentou após o upgrade.\n";
}

// Opcional: Reverter mudança para não poluir a base se necessário (mas o user quer validar comportamento real)
// $minaMetal->nivel -= 1;
// $minaMetal->save();
