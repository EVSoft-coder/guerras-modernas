<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$r = App\Models\Recurso::first();
echo json_encode([
    'suprimentos' => $r->suprimentos,
    'cap' => $r->storage_capacity,
    'ultimo_update' => $r->base->ultimo_update,
    'now' => now()->toDateTimeString()
]);
