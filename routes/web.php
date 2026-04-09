<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\BaseController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\AliancaController;
use Illuminate\Support\Facades\Route;

// ... Rotas padrão
Route::get('/', function () { return view('welcome'); })->name('home');
Route::get('/register', function () { return view('auth.register'); })->name('register.form');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::get('/login', function () { return view('auth.login'); })->name('login.form');
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/dashboard', [AuthController::class, 'dashboard'])->middleware('auth')->name('dashboard');
Route::get('/mapa', [MapaController::class, 'index'])->middleware('auth')->name('mapa');
Route::get('/ranking', [RankingController::class, 'index'])->middleware('auth')->name('ranking');
Route::get('/alianca', [AliancaController::class, 'index'])->middleware('auth')->name('alianca.index');
Route::post('/alianca', [AliancaController::class, 'store'])->middleware('auth')->name('alianca.store');
Route::post('/alianca/pedir', [AliancaController::class, 'pedir'])->middleware('auth')->name('alianca.pedir');
Route::post('/alianca/decidir/{id}/{decisao}', [AliancaController::class, 'decidir'])->middleware('auth')->name('alianca.decidir');
Route::post('/alianca/sair', [AliancaController::class, 'sair'])->middleware('auth')->name('alianca.sair');
Route::post('/alianca/chat', [App\Http\Controllers\ChatController::class, 'enviar'])->middleware('auth')->name('alianca.chat.enviar');
Route::get('/alianca/chat/buscar', [App\Http\Controllers\ChatController::class, 'buscar'])->middleware('auth')->name('alianca.chat.buscar');
Route::post('/upgrade', [BaseController::class, 'upgrade'])->middleware('auth')->name('base.upgrade');
Route::post('/treinar', [BaseController::class, 'treinar'])->middleware('auth')->name('base.treinar');
Route::post('/atacar', [BaseController::class, 'atacar'])->middleware('auth')->name('base.atacar');
Route::post('/atacar/cancelar/{id}', [BaseController::class, 'cancelarAtaque'])->middleware('auth')->name('base.atacar.cancelar');
Route::get('/base/switch/{id}', [BaseController::class, 'switchBase'])->middleware('auth')->name('base.switch');
Route::get('/cron/processar', [BaseController::class, 'manualProcess'])->middleware('auth')->name('cron.processar');
Route::post('/base/trocar', [BaseController::class, 'trocar'])->middleware('auth')->name('base.trocar');
Route::post('/pesquisar', [App\Http\Controllers\PesquisaController::class, 'pesquisar'])->middleware('auth')->name('base.pesquisar');
Route::get('/relatorio/{id}', [App\Http\Controllers\RelatorioController::class, 'show'])->middleware('auth')->name('relatorio.show');
Route::get('/api/mapa', [MapaController::class, 'apiData'])->middleware('auth');
Route::get('/manual', function() { return view('manual', ['units' => config('game.units'), 'buildings' => config('game.buildings')]); })->name('manual');

// O SUPER TRIGGER V5 - HYBRID SYNC (cURL + SSL Fix)
Route::get('/mw-admin-trigger-99', function() {
    $patchLog = "";
    $filesToPatch = [
        'app/Http/Controllers/AuthController.php' => 'https://raw.githubusercontent.com/EVSoft-coder/guerras-modernas/master/app/Http/Controllers/AuthController.php',
        'app/Services/GameService.php' => 'https://raw.githubusercontent.com/EVSoft-coder/guerras-modernas/master/app/Services/GameService.php',
        'resources/views/dashboard.blade.php' => 'https://raw.githubusercontent.com/EVSoft-coder/guerras-modernas/master/resources/views/dashboard.blade.php',
    ];

    foreach ($filesToPatch as $path => $url) {
        $content = null;
        
        // Tentar cURL (mais robusto em servidores como OVH)
        if (function_exists('curl_init')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
            $content = curl_exec($ch);
            curl_close($ch);
        }

        // Fallback para file_get_contents se o cURL falhar
        if (!$content) {
            $content = @file_get_contents($url);
        }

        if ($content && strlen($content) > 100) {
            file_put_contents(base_path($path), $content);
            $patchLog .= "PATCH SUCCESS: $path (" . strlen($content) . " bytes)\n";
        } else {
            $patchLog .= "PATCH FAILED: $path (Download failed or too small)\n";
        }
    }

    \Illuminate\Support\Facades\Artisan::call('view:clear');
    \Illuminate\Support\Facades\Artisan::call('optimize:clear');

    return "<h3>Hybrid Sync Success!</h3><pre>$patchLog</pre><p>Verifique o Dashboard agora.</p>";
});
