<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "App Time: " . now()->toDateTimeString() . "\n";
echo "Config Game Speed: " . config('game.speed.resources') . "\n";
echo "DB Connection: " . config('database.default') . "\n";
echo "DB Host: " . config('database.connections.mysql.host') . "\n";
