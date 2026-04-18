<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Base;
use App\Services\GameEngine;
use App\Services\UnitQueueService;
use App\Services\TimeService;
use Illuminate\Support\Facades\DB;

// Mock Time to fixed point
$time = new TimeService();
$now = $time->now();

$base = Base::first();
if (!$base) {
    echo "ERROR: No base found in DB.\n";
    exit;
}

echo "Testing BASE: {$base->id}\n";

// 1. Simular recrutamento de 10 unidades
$unitTypeId = 1; // Infantaria
$qty = 10;
$unitQueueService = new UnitQueueService($time);

try {
    echo "--- TEST 1: ENQUEUE ---\n";
    $id = $unitQueueService->startRecruitment($base, $unitTypeId, $qty);
    echo "Recruitment started (ID: $id)\n";

    $active = DB::table('unit_queue')->where('id', $id)->first();
    echo "Units produced initial: " . ($active->units_produced ?? 0) . "\n";

    echo "--- TEST 2: IDEMPOTENT PRODUCTION ---\n";
    // Avance 35 seconds (30s per unit) -> should produce 1 unit
    $future = $now->copy()->addSeconds(35);
    $timeFuture = new class($future) extends TimeService {
        private $f;
        public function __construct($f) { $this->f = $f; }
        public function now(): \Carbon\Carbon { return $this->f; }
    };

    $engine = new GameEngine(null, new UnitQueueService($timeFuture), null, null, $timeFuture);
    $engine->processBase($base);

    $active = DB::table('unit_queue')->where('id', $id)->first();
    echo "Units produced after 35s: " . ($active->units_produced ?? 0) . " (Expected: 1)\n";

    echo "Running engine AGAIN at SAME time...\n";
    $engine->processBase($base);
    $active = DB::table('unit_queue')->where('id', $id)->first();
    echo "Units produced after second run (idempotency): " . ($active->units_produced ?? 0) . " (Expected: 1)\n";

    echo "--- TEST 3: CANCELATION ---\n";
    $unitQueueService->cancelRecruitment($id);
    $exists = DB::table('unit_queue')->where('id', $id)->exists();
    echo "Item exists after cancel? " . ($exists ? 'YES' : 'NO') . "\n";

    echo "DONE. Tests passed if expectations match.\n";

} catch (\Exception $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
}
