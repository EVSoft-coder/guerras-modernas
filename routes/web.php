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
    try {
        \Illuminate\Support\Facades\Artisan::call('optimize:clear');
        $pdo = \Illuminate\Support\Facades\DB::connection()->getPdo();
        
        // Auto-Migration de Tabelas Críticas
        $pdo->exec("ALTER TABLE jogadores ADD COLUMN IF NOT EXISTS xp BIGINT DEFAULT 0");
        $pdo->exec("ALTER TABLE jogadores ADD COLUMN IF NOT EXISTS nivel INT DEFAULT 1");
        $pdo->exec("ALTER TABLE jogadores ADD COLUMN IF NOT EXISTS cargo VARCHAR(255) DEFAULT 'Recruta'");

        $pdo->exec("CREATE TABLE IF NOT EXISTS pesquisas (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
            jogador_id BIGINT UNSIGNED, 
            tipo VARCHAR(255), 
            nivel INT DEFAULT 0, 
            completado_em TIMESTAMP NULL, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS pedidos_alianca (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            jogador_id BIGINT UNSIGNED,
            alianca_id BIGINT UNSIGNED,
            status ENUM('pendente', 'aceite', 'recusado') DEFAULT 'pendente',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
        
        return "Tactical Override Success: Cache Cleared & DB Structured.";
    } catch (\Exception $e) {
        return "Tactical Override Error: " . $e->getMessage();
    }
});
