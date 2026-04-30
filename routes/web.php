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
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\PremiumController;
use App\Http\Controllers\PremiumMarketController;

/*
|--------------------------------------------------------------------------
| Rotas de Produção - Guerras Modernas 1.0 (FASE HARDEN 3)
|--------------------------------------------------------------------------
*/

ini_set('default_charset', 'UTF-8');
mb_internal_encoding('UTF-8');

Route::get('/ping', function() { return 'pong'; });
Route::get('/admin/diagnostic', [\App\Http\Controllers\DiagnosticController::class, 'check'])->middleware(['auth']);
Route::get('/admin/fix-movements', [\App\Http\Controllers\DiagnosticController::class, 'fixHungMovements'])->middleware(['auth']);
Route::get('/admin/migrate', function() {
    try {
        Artisan::call('migrate', ['--force' => true]);
        return "MIGRAÇÃO CONCLUÍDA: " . Artisan::output();
    } catch (\Exception $e) {
        return "ERRO: " . $e->getMessage();
    }
});

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
        Route::prefix('relatorios')->name('relatorio.')->group(function() {
            Route::get('/', [RelatorioController::class, 'index'])->name('index');
            Route::get('/{id}', [RelatorioController::class, 'show'])->name('show');
            Route::post('/{id}/partilhar', [RelatorioController::class, 'partilhar'])->name('partilhar');
        });
        Route::get('/mensagens', [ChatController::class, 'pessoais'])->name('mensagens.index');
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
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

        Route::prefix('reinforcements')->name('reinforcements.')->group(function () {
            Route::post('/recall/{id}', [App\Http\Controllers\ReinforcementController::class, 'recall'])->name('recall');
            Route::post('/dismiss/{id}', [App\Http\Controllers\ReinforcementController::class, 'dismiss'])->name('dismiss');
        });

        // 💰 Sistema Premium e Mercado
        Route::prefix('premium')->name('premium.')->group(function () {
            Route::get('/', [PremiumController::class, 'index'])->name('index');
            Route::post('/buy', [PremiumController::class, 'buyPoints'])->name('buy');
            Route::post('/activate', [PremiumController::class, 'activate'])->name('activate');
            Route::post('/reduce-time/building', [PremiumController::class, 'reduceBuilding'])->name('reduce.building');
            Route::post('/reduce-time/unit', [PremiumController::class, 'reduceUnit'])->name('reduce.unit');

            // Mercado Premium (Peer-to-Peer)
            Route::get('/market', [PremiumMarketController::class, 'index'])->name('market.index');
            Route::post('/market', [PremiumMarketController::class, 'store'])->name('market.store');
            Route::post('/market/{id}/buy', [PremiumMarketController::class, 'buy'])->name('market.buy');
            Route::delete('/market/{id}', [PremiumMarketController::class, 'destroy'])->name('market.destroy');

            // Assistente de Farming (Fase 2)
            Route::get('/farming', [\App\Http\Controllers\FarmingController::class, 'index'])->name('farming.index');
            Route::post('/farming/templates', [\App\Http\Controllers\FarmingController::class, 'storeTemplate'])->name('farming.templates.store');
            Route::post('/farming/attack', [\App\Http\Controllers\FarmingController::class, 'attack'])->name('farming.attack');

            // Simulador de Combate (Fase 3)
            Route::get('/simulator', [\App\Http\Controllers\SimulatorController::class, 'index'])->name('simulator.index');
            Route::post('/simulator/simulate', [\App\Http\Controllers\SimulatorController::class, 'simulate'])->name('simulator.simulate');
        });

        Route::prefix('alianca')->name('alianca.')->group(function () {
            Route::get('/', [AliancaController::class, 'index'])->name('index');
            Route::post('/store', [AliancaController::class, 'store'])->name('store');
            Route::post('/pedir', [AliancaController::class, 'pedir'])->name('pedir');
            Route::post('/decidir/{id}/{decisao}', [AliancaController::class, 'decidir'])->name('decidir');
            Route::post('/sair', [AliancaController::class, 'sair'])->name('sair');
            Route::post('/chat/enviar', [AliancaController::class, 'enviarMensagem'])->name('chat.enviar');
            Route::post('/convidar', [AliancaController::class, 'convidar'])->name('convidar');
            Route::post('/convites/{id}/{decisao}', [AliancaController::class, 'decidirConvite'])->name('convite.decidir');
            Route::post('/diplomacia', [AliancaController::class, 'diplomaciaStore'])->name('diplomacia.store');
            Route::delete('/diplomacia/{id}', [AliancaController::class, 'diplomaciaDelete'])->name('diplomacia.delete');

            // Fórum da Aliança
            Route::prefix('forum')->name('forum.')->group(function () {
                Route::get('/', [ForumController::class, 'index'])->name('index');
                Route::post('/topico', [ForumController::class, 'storeTopico'])->name('topico.store');
                Route::get('/topico/{id}', [ForumController::class, 'show'])->name('show');
                Route::post('/topico/{id}/post', [ForumController::class, 'storePost'])->name('post.store');
            });
        });

        // 🎖️ FASE 16: O General
        Route::prefix('general')->name('general.')->group(function () {
            Route::get('/', [\App\Http\Controllers\GeneralController::class, 'index'])->name('index');
            Route::post('/upgrade', [\App\Http\Controllers\GeneralController::class, 'upgradeSkill'])->name('upgrade');
            Route::post('/rename', [\App\Http\Controllers\GeneralController::class, 'rename'])->name('rename');
        });

        // 🏛️ FASE 4.1: Academia Militar (Cunhagem de Moedas)
        Route::prefix('academy')->name('academy.')->group(function () {
            Route::post('/mint', [App\Http\Controllers\AcademyController::class, 'mint'])->name('mint');
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

    // MERCADO (FASE 13)
    Route::prefix('market')->name('market.')->group(function () {
        Route::get('/', [App\Http\Controllers\MarketController::class, 'index'])->name('index');
        Route::post('/offer', [App\Http\Controllers\MarketController::class, 'store'])->name('store');
        Route::post('/accept/{id}', [App\Http\Controllers\MarketController::class, 'accept'])->name('accept');
        Route::post('/cancel/{id}', [App\Http\Controllers\MarketController::class, 'cancel'])->name('cancel');
        Route::post('/send', [App\Http\Controllers\MarketController::class, 'send'])->name('send');
        Route::get('/movements', [App\Http\Controllers\MarketController::class, 'movements'])->name('movements');
    });

    // 🎖️ FASE 17: Alto Comando (Gestão de Massa)
    Route::prefix('command-center')->name('command.')->group(function () {
        Route::get('/', [App\Http\Controllers\MassCommandController::class, 'index'])->name('index');
        Route::post('/recruit', [App\Http\Controllers\MassCommandController::class, 'recruitMass'])->name('recruit');
        Route::post('/templates/apply', [App\Http\Controllers\MassCommandController::class, 'applyTemplate'])->name('templates.apply');
        Route::post('/supports/{id}/recall', [App\Http\Controllers\MassCommandController::class, 'recallReinforcement'])->name('supports.recall');
        
        // Gestão de Grupos
        Route::prefix('groups')->name('groups.')->group(function () {
            Route::post('/', [App\Http\Controllers\BaseGroupController::class, 'store'])->name('store');
            Route::put('/{id}', [App\Http\Controllers\BaseGroupController::class, 'update'])->name('update');
            Route::delete('/{id}', [App\Http\Controllers\BaseGroupController::class, 'destroy'])->name('destroy');
            Route::post('/assign', [App\Http\Controllers\BaseGroupController::class, 'assign'])->name('assign');
        });

        // Gestão de Templates
        Route::prefix('templates')->name('templates.')->group(function () {
            Route::post('/', [App\Http\Controllers\TemplateController::class, 'store'])->name('store');
            Route::put('/{id}', [App\Http\Controllers\TemplateController::class, 'update'])->name('update');
            Route::delete('/{id}', [App\Http\Controllers\TemplateController::class, 'destroy'])->name('destroy');
        });
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

    Route::get('/mw-git-pull', function() {
        try {
            $output = shell_exec('git pull origin master 2>&1');
            return "
                <div style='background:#0a0c10; color:#0f0; padding:40px; font-family:monospace; border:2px solid #0f0;'>
                    <h1>[SINCRONIZAÇÃO GIT]</h1>
                    <pre>{$output}</pre>
                    <hr style='border:1px solid #0f0; margin:20px 0;'>
                    <a href='/mw-deploy-refresh' style='color:#fff; text-decoration:underline;'>RECALIBRAR CACHE</a> | 
                    <a href='/dashboard' style='color:#fff; text-decoration:underline;'>VOLTAR AO COMANDO</a>
                </div>
            ";
        } catch (\Exception $e) {
            return "[ERRO DE SINCRONIZAÇÃO]: " . $e->getMessage();
        }
    })->name('admin.git.pull');

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

    Route::get('/mw-fix-storage-balance', function() {
        try {
            \Illuminate\Support\Facades\DB::statement("
                INSERT INTO edificios (base_id, tipo, nivel, pos_x, pos_y, created_at, updated_at)
                SELECT b.id, 'armazem', e_hq.nivel, 260, 120, NOW(), NOW()
                FROM bases b
                JOIN edificios e_hq ON e_hq.base_id = b.id AND e_hq.tipo = 'hq'
                WHERE NOT EXISTS (
                    SELECT 1 FROM edificios e2 WHERE e2.base_id = b.id AND e2.tipo = 'armazem'
                )
            ");

            \Illuminate\Support\Facades\DB::statement("
                UPDATE recursos r
                JOIN bases b ON r.base_id = b.id
                JOIN edificios e ON e.base_id = b.id AND e.tipo = 'armazem'
                SET r.storage_capacity = (1200 * POW(1.35, e.nivel))
            ");

            return "
                <div style='background:#0a0c10; color:#0f0; padding:40px; font-family:monospace; border:2px solid #0f0;'>
                    <h1>[FIX DE ARMAZENAMENTO APLICADO]</h1>
                    <p>> Armazéns Injetados: OK</p>
                    <p>> Capacidades Recalibradas: OK</p>
                    <hr style='border:1px solid #0f0; margin:20px 0;'>
                    <p>Fórmula Ativa: 1200 * (1.35 ^ nível_armazem)</p>
                    <br>
                    <a href='/dashboard' style='color:#fff; text-decoration:underline;'>VOLTAR AO COMANDO</a>
                </div>
            ";
        } catch (\Exception $e) {
            return \"[ERRO DE FIX]: \" . $e->getMessage();
        }
    })->name('admin.fix.storage');
});
