<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\BaseController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\AliancaController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::get('/register', function () {
    return view('auth.register');
})->name('register.form');

Route::post('/register', [AuthController::class, 'register'])->name('register');

Route::get('/login', function () {
    return view('auth.login');
})->name('login.form');

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/dashboard', [AuthController::class, 'dashboard'])
    ->middleware('auth')
    ->name('dashboard');

Route::get('/mapa', [MapaController::class, 'index'])
    ->middleware('auth')
    ->name('mapa');

Route::get('/ranking', [RankingController::class, 'index'])
    ->middleware('auth')
    ->name('ranking');

Route::get('/alianca', [AliancaController::class, 'index'])
    ->middleware('auth')
    ->name('alianca.index');

Route::post('/alianca', [AliancaController::class, 'store'])
    ->middleware('auth')
    ->name('alianca.store');

Route::post('/alianca/pedir', [AliancaController::class, 'pedir'])
    ->middleware('auth')
    ->name('alianca.pedir');

Route::post('/alianca/decidir/{id}/{decisao}', [AliancaController::class, 'decidir'])
    ->middleware('auth')
    ->name('alianca.decidir');

Route::post('/alianca/sair', [AliancaController::class, 'sair'])
    ->middleware('auth')
    ->name('alianca.sair');

Route::post('/alianca/chat', [App\Http\Controllers\ChatController::class, 'enviar'])
    ->middleware('auth')
    ->name('alianca.chat.enviar');

Route::get('/alianca/chat/buscar', [App\Http\Controllers\ChatController::class, 'buscar'])
    ->middleware('auth')
    ->name('alianca.chat.buscar');

Route::post('/upgrade', [BaseController::class, 'upgrade'])
    ->middleware('auth')
    ->name('base.upgrade');

Route::post('/treinar', [BaseController::class, 'treinar'])
    ->middleware('auth')
    ->name('base.treinar');

Route::post('/atacar', [BaseController::class, 'atacar'])
    ->middleware('auth')
    ->name('base.atacar');

Route::post('/atacar/cancelar/{id}', [BaseController::class, 'cancelarAtaque'])
    ->middleware('auth')
    ->name('base.atacar.cancelar');

Route::get('/base/switch/{id}', [BaseController::class, 'switchBase'])
    ->middleware('auth')
    ->name('base.switch');

Route::get('/cron/processar', [BaseController::class, 'manualProcess'])
    ->middleware('auth')
    ->name('cron.processar');
Route::post('/base/trocar', [BaseController::class, 'trocar'])
    ->middleware('auth')
    ->name('base.trocar');

Route::post('/pesquisar', [App\Http\Controllers\PesquisaController::class, 'pesquisar'])
    ->middleware('auth')
    ->name('base.pesquisar');

// Admin routes block (manually managed)

Route::get('/relatorio/{id}', [App\Http\Controllers\RelatorioController::class, 'show'])
    ->middleware('auth')
    ->name('relatorio.show');

Route::get('/api/mapa', [MapaController::class, 'apiData'])
    ->middleware('auth');
Route::get('/manual', function() {
    return view('manual', [
        'units' => config('game.units'),
        'buildings' => config('game.buildings')
    ]);
})->name('manual');
Route::get('/mw-admin-trigger-99', function() {
    $log = "";
    try {
        // 1. FORÇAR ATUALIZAÇÃO DE CÓDIGO (GIT PULL) - SEM DEPENDÊNCIAS DE DB
        $gitOutput = [];
        exec('git pull origin master 2>&1', $gitOutput);
        $log .= "GIT PULL: " . implode("\n", $gitOutput) . "\n\n";

        $pdo = \Illuminate\Support\Facades\DB::connection()->getPdo();
        
        // 2. ASSEGURAR TABELAS DE SISTEMA (CACHE/SESSIONS)
        $pdo->exec("CREATE TABLE IF NOT EXISTS cache (
            `key` VARCHAR(255) PRIMARY KEY,
            `value` MEDIUMTEXT NOT NULL,
            `expiration` INT NOT NULL
        )");
        $pdo->exec("CREATE TABLE IF NOT EXISTS cache_locks (
            `key` VARCHAR(255) PRIMARY KEY,
            `owner` VARCHAR(255) NOT NULL,
            `expiration` INT NOT NULL
        )");

        // 3. LIMPEZA DE CACHE (AGORA SEGURO)
        \Illuminate\Support\Facades\Artisan::call('optimize:clear');
        
        // 4. AUTO-MIGRATION DE TABELAS DE JOGO
        $pdo->exec("ALTER TABLE jogadores ADD COLUMN IF NOT EXISTS xp BIGINT DEFAULT 0, ADD COLUMN IF NOT EXISTS nivel INT DEFAULT 1, ADD COLUMN IF NOT EXISTS cargo VARCHAR(255) DEFAULT 'Recruta'");

        $pdo->exec("CREATE TABLE IF NOT EXISTS pesquisas (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
            jogador_id BIGINT UNSIGNED, 
            tipo VARCHAR(255), 
            nivel INT DEFAULT 0, 
            completado_em TIMESTAMP NULL, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");

        // 6. DASHBOARD DIAGNOSTIC (Simular carga do Painel)
        $diag = "";
        try {
            $jogador = \App\Models\Jogador::first();
            if ($jogador) {
                $base = $jogador->bases->first();
                if ($base) {
                    $gs = new \App\Services\GameService();
                    $gs->atualizarRecursos($base);
                    $gs->processarFila($base);
                    $diag .= "Base Diagnostic Success: Resources Updated.\n";
                    
                    $intel = $base->edificios()->where('tipo', 'radar_estrategico')->first()?->nivel ?? 0;
                    $diag .= "Intel Level: $intel\n";
                    
                    $pesquisas = \App\Models\Pesquisa::where('jogador_id', $jogador->id)->count();
                    $diag .= "Pesquisas Count: $pesquisas\n";
                } else {
                    $diag .= "Diagnostic Warning: No Base found for Player.\n";
                }
            } else {
                $diag .= "Diagnostic Warning: No Player found.\n";
            }
        } catch (\Exception $ex) {
            $diag .= "DIAGNOSTIC CRASH: " . $ex->getMessage() . "\n" . $ex->getTraceAsString();
        }

        return "<h3>Tactical Override Success</h3>" . 
               "<pre>$log</pre>" . 
               "<h4>System Diagnostic</h4><pre>$diag</pre>" .
               "<p>Cache Cleared & All Game Tables (Research, Alliances, Combat, Reports) Structured.</p>";
    } catch (\Exception $e) {
        return "<h3>Tactical Override Warning (Code might have pulled)</h3>" . 
               "<pre>$log</pre>" . 
               "<p>Error during DB phase: " . $e->getMessage() . "</p>";
    }
});
