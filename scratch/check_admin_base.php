<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Base;
use App\Models\Jogador;

$jogador = Jogador::where('username', 'admin')->first(); // Assuming 'admin' is the user from screenshot
if (!$jogador) {
    echo "Jogador não encontrado.\n";
    exit;
}

foreach ($jogador->bases as $base) {
    echo "Base: {$base->nome} (ID: {$base->id})\n";
    $recursos = $base->recursos;
    echo "  Recursos ID: " . ($recursos->id ?? 'N/A') . "\n";
    echo "  Suprimentos: {$recursos->suprimentos}\n";
    echo "  Combustível: {$recursos->combustivel}\n";
    echo "  Munições: {$recursos->municoes}\n";
    echo "  Pessoal: {$recursos->pessoal}\n";
    echo "  Last Update: {$recursos->updated_at}\n";
    
    echo "  Edifícios:\n";
    foreach ($base->edificios as $ed) {
        echo "    - {$ed->tipo}: Nível {$ed->nivel}\n";
    }
}
