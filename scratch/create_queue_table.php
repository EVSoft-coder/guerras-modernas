<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    if (!Schema::hasTable('building_queue')) {
        DB::statement("
            CREATE TABLE building_queue (
                id INT AUTO_INCREMENT PRIMARY KEY,
                base_id BIGINT UNSIGNED NOT NULL,
                building_type VARCHAR(50) NOT NULL,
                target_level INT NOT NULL,
                started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                finishes_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
        echo "Tabela 'building_queue' criada com sucesso!";
    } else {
        echo "Tabela 'building_queue' já existe.";
    }
} catch (\Exception $e) {
    echo "Erro: " . $e->getMessage();
}
