<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    Illuminate\Support\Facades\DB::connection()->getPdo();
    echo "Conexão OK\n";
} catch (\Exception $e) {
    echo "Erro: " . $e->getMessage() . "\n";
}
