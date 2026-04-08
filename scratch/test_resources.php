<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$config = config('game');
echo "Speed Res: " . ($config['speed']['resources'] ?? 'N/A') . "\n";
echo "Prod Sup: " . ($config['production']['suprimentos'] ?? 'N/A') . "\n";

$baseProd = 50;
$speed = 10;
$scaling = 1.5;
$nivel = 0;

$porHora = ($baseProd * $speed) * (1 + ($nivel * $scaling));
$porSegundo = $porHora / 3600;
echo "Por Segundo: " . $porSegundo . "\n";

$segundos = 60;
$ganho = $porSegundo * $segundos;
echo "Ganho em 60s: " . $ganho . "\n";
echo "Floor Ganho: " . floor($ganho) . "\n";
