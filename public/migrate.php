<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$status = $kernel->call('migrate', ['--force' => true]);

echo "<h1>Migrações executadas!</h1>";
echo "<pre>" . $kernel->output() . "</pre>";

if ($status === 0) {
    echo "<p style='color:green; font-size:20px;'>✅ Todas as tabelas foram criadas com sucesso!</p>";
} else {
    echo "<p style='color:red;'>❌ Algo correu mal. Verifica o output acima.</p>";
}