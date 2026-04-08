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

Route::get('/base/switch/{id}', [BaseController::class, 'switchBase'])
    ->middleware('auth')
    ->name('base.switch');

Route::get('/cron/processar', [BaseController::class, 'manualProcess'])
    ->middleware('auth')
    ->name('cron.processar');

Route::get('/relatorio/{id}', [App\Http\Controllers\RelatorioController::class, 'show'])
    ->middleware('auth')
    ->name('relatorio.show');

Route::get('/api/mapa', [MapaController::class, 'apiData'])
    ->middleware('auth');
Route::get('/test-db', function() {
     = \App\Models\Base::first();
    if (!) return 'Sem bases.';
    
     = ->recursos;
     = ->suprimentos;
    
    \Illuminate\Support\Facades\DB::table('recursos')
        ->where('id', ->id)
        ->increment('suprimentos', 10);
        
     = \App\Models\Base::first()->recursos->suprimentos;
    
    return 'Base: ' . ->id . ', Antigo: ' .  . ', Novo: ' .  . ' (Diferenca: ' . ( - ) . ')';
});
