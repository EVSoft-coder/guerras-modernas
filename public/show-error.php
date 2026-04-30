<?php
/**
 * Script de Diagnóstico de Emergência
 * Tenta carregar o Laravel e mostrar o erro real.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    echo "<h1>[DIAGNÓSTICO LARAVEL]</h1>";
    
    $path = __DIR__ . '/../vendor/autoload.php';
    if (!file_exists($path)) {
        die("<p style='color:red'>ERRO CRÍTICO: Ficheiro 'vendor/autoload.php' não encontrado! O deploy falhou ao instalar as dependências.</p>");
    }
    
    echo "<p style='color:green'>Autoloader encontrado. A tentar carregar aplicação...</p>";
    require $path;

    $appPath = __DIR__ . '/../bootstrap/app.php';
    if (!file_exists($appPath)) {
        die("<p style='color:red'>ERRO CRÍTICO: Ficheiro 'bootstrap/app.php' não encontrado!</p>");
    }

    $app = require_once $appPath;

    echo "<p style='color:green'>Aplicação instanciada. A tentar processar Kernel...</p>";
    
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(
        $request = Illuminate\Http\Request::capture()
    );

    echo "<h2>Resultado do Kernel:</h2>";
    echo "Status: " . $response->getStatusCode();
    
} catch (\Throwable $e) {
    echo "<h2>ERRO CAPTURADO:</h2>";
    echo "<div style='background:#fee; padding:20px; border:2px solid red; font-family:monospace;'>";
    echo "<strong>Mensagem:</strong> " . $e->getMessage() . "<br><br>";
    echo "<strong>Ficheiro:</strong> " . $e->getFile() . " (Linha " . $e->getLine() . ")<br><br>";
    echo "<strong>Trace:</strong><pre>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
}
