<?php

use Illuminate\Support\Facades\DB;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$reports = DB::table('relatorios')->orderBy('created_at', 'desc')->limit(5)->get();
echo json_encode($reports, JSON_PRETTY_PRINT);
