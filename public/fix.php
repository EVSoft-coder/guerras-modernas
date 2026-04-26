<?php
/**
 * Script de Emergência para Recuperação de 503
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🛠️ MW Emergency Fix</h1>";

function run($cmd) {
    echo "<li>A correr: <code>$cmd</code>... ";
    $output = [];
    $return_var = 0;
    exec("php ../artisan $cmd 2>&1", $output, $return_var);
    if ($return_var === 0) {
        echo "<b style='color:green'>SUCESSO</b></li>";
    } else {
        echo "<b style='color:red'>FALHOU</b> (Código: $return_var)</li>";
        echo "<pre>" . implode("\n", $output) . "</pre>";
    }
}

echo "<ul>";
run("up"); // Tira do modo de manutenção
run("config:clear");
run("cache:clear");
run("route:clear");
run("view:clear");
echo "</ul>";

echo "<h3>📡 Teste de Base de Dados:</h3>";
try {
    // Tenta carregar o bootstrap para testar o Eloquent
    require __DIR__.'/../vendor/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    
    if (\Illuminate\Support\Facades\DB::connection()->getPdo()) {
        echo "<p style='color:green'>✅ Base de Dados Conectada com Sucesso!</p>";
        echo "<p>Nome da BD: " . \Illuminate\Support\Facades\DB::connection()->getDatabaseName() . "</p>";
    }
} catch (\Exception $e) {
    echo "<p style='color:red'>❌ Falha na Base de Dados: " . $e->getMessage() . "</p>";
}

echo "<hr><p><b>Agora tenta abrir o <a href='/dashboard'>Dashboard</a>.</b> Se continuar a falhar, o erro acima deve dar-nos a pista final.</p>";
