<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BaseController;
use App\Http\Controllers\AliancaController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ManualController;
use App\Http\Controllers\RelatorioController;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Rotas de Produção - Guerras Modernas 1.0
|--------------------------------------------------------------------------
*/

// Forçar UTF-8 e Configurações de Ambiente
ini_set('default_charset', 'UTF-8');
mb_internal_encoding('UTF-8');

// Landing Page e Autenticação
Route::get('/', function () { return view('welcome'); });
Route::get('/login', [AuthController::class, 'showLogin'])->name('login.form');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register.form');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Rotas Protegidas (Requer Login)
Route::middleware(['auth'])->group(function () {
    
    // Core Game
    Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');
    Route::get('/mapa', [MapaController::class, 'index'])->name('mapa');
    Route::get('/ranking', [RankingController::class, 'index'])->name('ranking');
    Route::get('/manual', [ManualController::class, 'index'])->name('manual');
    Route::get('/perfil', [AuthController::class, 'perfil'])->name('perfil');
    
    // Gestão de Base
    Route::prefix('base')->name('base.')->group(function () {
        Route::get('/switch/{id}', [BaseController::class, 'switchBase'])->name('switch');
        Route::post('/upgrade', [BaseController::class, 'upgrade'])->name('upgrade');
        Route::post('/treinar', [BaseController::class, 'treinar'])->name('treinar');
        Route::post('/atacar', [BaseController::class, 'atacar'])->name('atacar');
        Route::post('/atacar/cancelar/{id}', [BaseController::class, 'cancelarAtaque'])->name('atacar.cancelar');
        Route::post('/trocar', [BaseController::class, 'trocar'])->name('trocar');
        Route::post('/simular', [BaseController::class, 'simular'])->name('simular');
        Route::post('/pesquisar', [BaseController::class, 'pesquisar'])->name('pesquisar');
    });

    // Diplomacia e Alianças
    Route::prefix('alianca')->name('alianca.')->group(function () {
        Route::get('/', [AliancaController::class, 'index'])->name('index');
        Route::post('/store', [AliancaController::class, 'store'])->name('store');
        Route::post('/pedir', [AliancaController::class, 'pedir'])->name('pedir');
        Route::post('/sair', [AliancaController::class, 'sair'])->name('sair');
        Route::post('/decidir/{id}/{decisao}', [AliancaController::class, 'decidir'])->name('decidir');
        
        // Chat de Aliança
        Route::get('/chat/buscar', [ChatController::class, 'buscar'])->name('chat.buscar');
        Route::post('/chat/enviar', [ChatController::class, 'enviar'])->name('chat.enviar');
    });

    // Informação e Inteligência
    Route::get('/relatorios/{id}', [RelatorioController::class, 'show'])->name('relatorio.show');
    Route::get('/mensagens', [ChatController::class, 'pessoais'])->name('mensagens.index');

    // Engine de Jogo
    Route::get('/cron-run', function() { 
        Artisan::call('cron:processar'); 
        return redirect()->back()->with('success', 'Sincronizado!'); 
    })->name('cron.processar');

    // Administração e Diagnóstico (Apenas Admin)
    Route::middleware(['can:admin-only'])->group(function () {
        Route::get('/mw-console-logs', [LogController::class, 'index'])->name('admin.logs');
        Route::get('/mw-console-logs/fetch', [LogController::class, 'fetch'])->name('admin.logs.fetch');
        Route::get('/mw-console-logs/clear', [LogController::class, 'clear'])->name('admin.logs.clear');
        
        // Gatilho de Emergência
        Route::get('/mw-admin-trigger-99', function() {
            return "Script de Emergência Ativo. Use para correções rápidas.";
        });
    });
});
