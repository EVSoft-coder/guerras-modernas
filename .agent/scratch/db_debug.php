<?php
require __DIR__ . '/../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\UnitType;
use App\Models\Unit;
use App\Models\Base;

$types = UnitType::all();
echo "UNIT TYPES:\n";
foreach ($types as $type) {
    echo "ID: {$type->id} | Name: {$type->name}\n";
}

$bases = Base::all();
echo "\nBASES:\n";
foreach ($bases as $base) {
    echo "ID: {$base->id} | Name: {$base->nome}\n";
    $units = Unit::where('base_id', $base->id)->get();
    foreach ($units as $unit) {
        echo "  - TypeID: {$unit->unit_type_id} | Qty: {$unit->quantity}\n";
    }
}
