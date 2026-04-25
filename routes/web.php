<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BaseController;
use App\Http\Controllers\AliancaController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ManualController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\UnitRecruitmentController;

/*
|--------------------------------------------------------------------------
| Rotas de Produção - Guerras Modernas 1.0 (FASE HARDEN 3)
|--------------------------------------------------------------------------
*/

ini_set('default_charset', 'UTF-8');
mb_internal_encoding('UTF-8');

Route::get('/', function () { return redirect()->route('dashboard'); })->name('home');
Route::get('/login', [AuthController::class, 'showLogin'])->name('login')->withoutMiddleware(['auth']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register.form');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Rotas Protegidas - FASE HARDEN 3
Route::get('/manual', [\App\Http\Controllers\ManualController::class, 'index'])->name('manual');
Route::middleware(['auth'])->group(function () {
    
    // 1. LEITURA (Rate Limit Elevado - PASSO 5)
    Route::middleware(['throttle:120,1'])->group(function() {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/mapa', [MapaController::class, 'index'])->name('mapa');
        Route::get('/api/mapa/data', [MapaController::class, 'apiData'])->name('api.mapa.data');
        Route::get('/api/mapa/chunk/{cx}/{cy}', [MapaController::class, 'apiChunk'])->name('api.mapa.chunk');
        Route::get('/ranking', [RankingController::class, 'index'])->name('ranking');
        Route::get('/manual', [ManualController::class, 'index'])->name('manual');
        Route::get('/perfil', [AuthController::class, 'perfil'])->name('perfil');
        Route::get('/relatorios', [RelatorioController::class, 'index'])->name('relatorio.index');
        Route::get('/relatorios/{id}', [RelatorioController::class, 'show'])->name('relatorio.show');
        Route::get('/mensagens', [ChatController::class, 'pessoais'])->name('mensagens.index');
    });

    // 2. AÇÕES CRÍTICAS (Rate Limit Elevado para Jogabilidade - PASSO 5)
    Route::middleware(['throttle:60,1'])->group(function() {
        Route::post('/buildings/upgrade', [BaseController::class, 'upgrade'])->name('buildings.upgrade');
        Route::post('/units/recruit', [UnitRecruitmentController::class, 'recruit'])->name('units.recruit');
        Route::post('/units/cancelar/{id}', [UnitRecruitmentController::class, 'cancel'])->name('units.cancelar');
        Route::post('/units/subir/{id}', [UnitRecruitmentController::class, 'moveUp'])->name('units.subir');
        Route::post('/units/descer/{id}', [UnitRecruitmentController::class, 'moveDown'])->name('units.descer');
        
        Route::prefix('base')->name('base.')->group(function () {
            Route::get('/switch/{id}', [BaseController::class, 'switchBase'])->name('switch');
            Route::post('/upgrade', [BaseController::class, 'upgrade'])->name('upgrade');
            Route::post('/upgrade/cancelar/{id}', [BaseController::class, 'cancelUpgrade'])->name('upgrade.cancelar');
            Route::post('/upgrade/subir/{id}', [BaseController::class, 'moveUp'])->name('upgrade.subir');
            Route::post('/upgrade/descer/{id}', [BaseController::class, 'moveDown'])->name('upgrade.descer');
            Route::post('/treinar', [BaseController::class, 'treinar'])->name('treinar');
            Route::post('/atacar', [App\Http\Controllers\AtaqueController::class, 'enviar'])->name('atacar');
            Route::post('/atacar/cancelar/{id}', [App\Http\Controllers\AtaqueController::class, 'cancelar'])->name('atacar.cancelar');
            Route::post('/bootstrap', [BaseController::class, 'bootstrap'])->name('bootstrap');
            Route::post('/trocar', [BaseController::class, 'trocar'])->name('trocar');
            Route::post('/pesquisar', [App\Http\Controllers\PesquisaController::class, 'pesquisar'])->name('pesquisar');
        });

        Route::prefix('alianca')->name('alianca.')->group(function () {
            Route::post('/store', [AliancaController::class, 'store'])->name('store');
            Route::post('/pedir', [AliancaController::class, 'pedir'])->name('pedir');
            Route::post('/sair', [AliancaController::class, 'sair'])->name('sair');
            Route::post('/decidir/{id}/{decisao}', [AliancaController::class, 'decidir'])->name('decidir');
            Route::post('/chat/enviar', [ChatController::class, 'enviar'])->name('chat.enviar');
        });
    });

    // Outros
    Route::get('/alianca', [AliancaController::class, 'index'])->name('alianca.index');
    Route::get('/cron-run', function() { Artisan::call('cron:processar'); return redirect()->back(); })->name('cron.processar');
    
    // MENSAGENS E RELATÓRIOS (FASE 7)
    Route::prefix('mensagens')->name('mensagens.')->group(function () {
        Route::get('/', [App\Http\Controllers\MensagemController::class, 'index'])->name('index');
        Route::get('/nao-lidas', [App\Http\Controllers\MensagemController::class, 'naoLidasCount'])->name('count');
        Route::get('/{id}', [App\Http\Controllers\MensagemController::class, 'show'])->name('show');
        Route::post('/enviar', [App\Http\Controllers\MensagemController::class, 'enviar'])->name('enviar');
        Route::delete('/{id}', [App\Http\Controllers\MensagemController::class, 'apagar'])->name('apagar');
        Route::post('/marcar-lidas', [App\Http\Controllers\MensagemController::class, 'marcarTodasLidas'])->name('marcar.lidas');
    });
});

// Admin
Route::middleware(['auth', 'can:admin-only'])->group(function () {
    Route::get('/mw-console-logs', [LogController::class, 'index'])->name('admin.logs');
    
    // ESCOTILHA DE EMERGÊNCIA (DEPLOY REMOTO V11.3)
    Route::get('/mw-deploy-refresh', function() {
        try {
            Artisan::call('optimize:clear');
            Artisan::call('view:clear');
            Artisan::call('config:clear');
            return "
                <div style='background:#0a0c10; color:#0f0; padding:40px; font-family:monospace; border:2px solid #0f0;'>
                    <h1>[SISTEMA RECALIBRADO]</h1>
                    <p>> Cache de Rotas: PURGADA</p>
                    <p>> Cache de Configuração: PURGADA</p>
                    <p>> Cache de Views: PURGADA</p>
                    <p>> Manifest de Assets: SINCRONIZADO</p>
                    <hr style='border:1px solid #0f0; margin:20px 0;'>
                    <p>Status: OPERACIONAL - V11.3 SÓLIDA ATIVA</p>
                    <br>
                    <a href='/dashboard' style='color:#fff; text-decoration:underline;'>VOLTAR AO COMANDO</a>
                </div>
            ";
        } catch (\Exception $e) {
            return "[ERRO TÁTICO]: " . $e->getMessage();
        }
    })->name('admin.deploy.refresh');

    Route::get('/mw-deploy-migrate', function() {
        try {
            Artisan::call('migrate', ['--force' => true]);
            return "
                <div style='background:#0a0c10; color:#0f0; padding:40px; font-family:monospace; border:2px solid #0f0;'>
                    <h1>[BASE DE DADOS ATUALIZADA]</h1>
                    <pre>" . Artisan::output() . "</pre>
                    <hr style='border:1px solid #0f0; margin:20px 0;'>
                    <a href='/dashboard' style='color:#fff; text-decoration:underline;'>VOLTAR AO COMANDO</a>
                </div>
            ";
        } catch (\Exception $e) {
            return "[ERRO DE MIGRAÇÃO]: " . $e->getMessage();
        }
    })->name('admin.deploy.migrate');

    // ALDEIAS NPC (FASE 6)
    Route::get('/mw-npc-generate', function() {
        $npcService = app(\App\Services\NpcService::class);
        $existing = $npcService->countNpcVillages();
        $force = request('force', false);
        
        if ($existing >= 500 && !$force) {
            return "
                <div style='background:#0a0c10; color:#ff0; padding:40px; font-family:monospace; border:2px solid #ff0;'>
                    <h1>[NPC ALERTA]</h1>
                    <p>Já existem {$existing} aldeias NPC no mapa.</p>
                    <p>Geração bloqueada para evitar excesso.</p>
                    <a href='/mw-npc-generate?force=1&count=300' style='color:#0f0;'>Forçar geração de +300</a> |
                    <a href='/mw-npc-generate?force=1&count=700' style='color:#0f0;'>Forçar geração de +700</a> |
                    <a href='/dashboard' style='color:#fff;'>VOLTAR</a>
                </div>
            ";
        }
        
        $count = request('count', 700);
        $generated = $npcService->generateNpcVillages((int)$count);
        return "
            <div style='background:#0a0c10; color:#0f0; padding:40px; font-family:monospace; border:2px solid #0f0;'>
                <h1>[NPC GERAÇÃO COMPLETA]</h1>
                <p>> Aldeias NPC geradas: {$generated}</p>
                <p>> Total NPC no mapa: " . $npcService->countNpcVillages() . "</p>
                <hr style='border:1px solid #0f0; margin:20px 0;'>
                <a href='/dashboard' style='color:#fff; text-decoration:underline;'>VOLTAR AO COMANDO</a>
            </div>
        ";
    })->name('admin.npc.generate');

    Route::get('/mw-npc-grow', function() {
        $npcService = app(\App\Services\NpcService::class);
        $grown = $npcService->growNpcVillages();
        return response()->json(['grown' => $grown, 'message' => "{$grown} aldeias NPC cresceram."]);
    })->name('admin.npc.grow');
});
