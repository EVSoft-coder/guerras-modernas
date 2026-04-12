<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->call('cache:clear');
$app->make('Illuminate\Contracts\Console\Kernel')->call('view:clear');
$app->make('Illuminate\Contracts\Console\Kernel')->call('config:clear');
echo "Caches limpas!";
?>
