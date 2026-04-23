<?php

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';

use App\Services\ResourceService;
use App\Models\Base;
use App\Models\Edificio;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

function testProgression($tipo) {
    $config = config('game.production')[$tipo];
    echo "--- TESTE DE PROGRESSÃO: " . strtoupper($tipo) . " ---\n";
    echo "Base: {$config['base']}, Factor: {$config['factor']}\n";
    
    foreach ([1, 5, 10, 20] as $level) {
        $rate = $config['base'] * pow($config['factor'], $level);
        echo "Nível $level: " . number_format($rate, 2) . " / hora\n";
    }
    echo "\n";
}

testProgression('mina_suprimentos');
testProgression('mina_metal');
testProgression('central_energia');
testProgression('refinaria');
testProgression('fabrica_municoes');
testProgression('housing');
