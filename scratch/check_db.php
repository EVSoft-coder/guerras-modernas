<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

$type = Schema::getColumnType('recursos', 'suprimentos');
echo "Column Type: " . $type . "\n";

$sample = DB::table('recursos')->first();
echo "Sample Row:\n";
print_r($sample);
