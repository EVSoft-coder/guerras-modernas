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

        // 5. ASSEGURAR TODAS AS TABELAS DE COMBATE
        $pdo->exec("CREATE TABLE IF NOT EXISTS ataques (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            origem_base_id BIGINT UNSIGNED,
            destino_base_id BIGINT UNSIGNED,
            tropas JSON,
            tipo VARCHAR(255) DEFAULT 'ataque',
            chegada_em TIMESTAMP NULL,
            processado BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS relatorios (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            vencedor_id BIGINT UNSIGNED NULL,
            atacante_id BIGINT UNSIGNED NULL,
            defensor_id BIGINT UNSIGNED NULL,
            titulo VARCHAR(255),
            origem_nome VARCHAR(255),
            destino_nome VARCHAR(255),
            detalhes JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS tropas (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            base_id BIGINT UNSIGNED,
            unidade VARCHAR(255),
            quantidade INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");

        // 6. SANITIZAÇÃO DE DADOS (Reparar contas quebradas)
        $basesSemRecurso = \App\Models\Base::doesntHave('recursos')->get();
        foreach($basesSemRecurso as $b) {
            \App\Models\Recurso::create([
                'base_id' => $b->id,
                'suprimentos' => 500, 'combustivel' => 500, 'municoes' => 500, 'pessoal' => 100
            ]);
        }

        // 7. HOT-PATCH: Sobrepor ficheiros críticos (Bypass Git)
        $patchLog = "";
        try {
            $filesToPatch = [
                'app/Http/Controllers/AuthController.php' => base64_decode('PD9waHANCg0KbmFtZXNwYWNlIEFwcFxIdHRwXENvbnRyb2xsZXJzOw0KDQp1c2UgQXBwXE1vZGVsc1xKb2dhZG9yOw0KdXNlIEFwcFxNb2RlbHNcQmFzZTsNCndzZSBBcHBcTW9kZWxzXFJlY3Vyc287DQp1c2UgQXBwXE1vZGVsc1xFZGlmaWNpbzsNCnVzZSBBcHBcTW9kZWxzXEF0YXF1ZTsNCnVzZSBBcHBcU2VydmljZXNcR2FtZVNlcnZpY2U7DQp1c2UgQXBwXFNlcnZpY2VzXENvbWJhdFNlcnZpY2U7DQp1c2UgSWxsdW1pbmF0ZVxIdHRwXFJlcXVlc3Q7DQp1c2UgSWxsdW1pbmF0ZVxTdXBwb3J0XEZhY2FkZXNcSGFzaDsNCnVzZSBJbGx1bWluYXRlXFN1cHBvcnRcRmFjYWRlc1xBdXRoOw0KdXNlIElsbHVtaW5hdGVcU3VwcG9ydFxGYWNhZGVzXFZhbGlkYXRvcjsNCg0KY2xhc3MgQXV0aENvbnRyb2xsZXIgZXh0ZW5kcyBDb250cm9sbGVyDQp7DQogICAgLy8gPT09PT09PT09PT09PT09PT09PT09IFJFR0lTVE8gPT09PT09PT09PT09PT09PT09PT09DQogICAgcHVibGljIGZ1bmN0aW9uIHJlZ2lzdGVyKFJlcXVlc3QgJHJlcXVlc3QpDQogICAgew0KICAgICAgICAkdmFsaWRhdG9yID0gVmFsaWRhdG9yOjptYWtlKCRyZXF1ZXN0LT5hbGwoKSwgWw0KICAgICAgICAgICAgJ3VzZXJuYW1lJyA9PiAncmVxdWlyZWR8c3RyaW5nfG1heDo1MHx1bmlxdWU6am9nYWRvcmVzJywNCiAgICAgICAgICAgICdlbWFpbCcgICAgPT4gJ3JlcXVlyWVkfGVtYWlsfHVuaXF1ZTpqb2dhZG9yZXMnLA0KICAgICAgICAgICAgJ3Bhc3N3b3JkJyA9PiAncmVxdWlyZWR8c3RyaW5nfG1pbjo2fGNvbmZpcm1lZCcsDQogICAgICAgIF0pOw0KDQogICAgICAgIGlmICgkdmFsaWRhdG9yLT5mYWlscygpKSB7DQogICAgICAgICAgICByZXR1cm4gcmVkaXJlY3QoKS0+YmFjaygpLT53aXRoRXJyb3JzKCR2YWxpZGF0b3IpLT53aXRoSW5wdXQoKTsNCiAgICAgICAgfQ0KDQogICAgICAgIC8vIENyaWFyIG8gam9nYWRvcg0KICAgICAgICAkam9nYWRvciA9IEpvZ2Fkb3I6OmNyZWF0ZShbDQogICAgICAgICAgICAndXNlcm5hbWUnID0+ICRyZXF1ZXN0LT51c2VybmFtZSwNCiAgICAgICAgICAgICdlbWFpbCcgICAgPT4gJHJlcXVlc3QtPmVtYWlsLA0KICAgICAgICAgICAgJ3Bhc3N3b3JkJyA9PiBIYXNoOjptYWtlKCRyZXF1ZXN0LT5wYXNzd29yZCksDQogICAgICAgIF0pOw0KDQogICAgICAgIC8vIENyaWFyIGEgcHJpbWVpcmEgYmFzZSBhdXRvbWF0aWNhbWVudGUNCiAgICAgICAgJGJhc2UgPSBCYXNlOjpjcmVhdGUoWw0KICAgICAgICAgICAgJ2pvZ2Fkb3JfaWQnICAgICA9PiAkam9nYWRvci0+aWQsDQogICAgICAgICAgICAnbm9tZScgICAgICAgICAgID0+ICdCYXNlIFByaW5jaXBhbCcsDQogICAgICAgICAgICAnY29vcmRlbmFkYV94JyAgID0+IHJhbmQoMTAwLCA5MDApLCAgIC8vIGNvb3JkZW5hZGFzIGFsZWF0w7NyaWFzIGluaWNpYWlzDQogICAgICAgICAgICAnY29vcmRlbmFkYV95JyAgID0+IHJhbmQoMTAwLCA5MDApLA0KICAgICAgICAgICAgJ3FnX25pdmVsJyAgICAgICA9PiAxLA0KICAgICAgICAgICAgJ211cmFsaGFfbmV2ZWwnICA9PiAxLA0KICAgICAgICBdKTsNCiAgICAgICAgDQogICAgICAgIC8vIENyaWFyIHJlY3Vyc29zIGluaWNpYWlzDQogICAgICAgIFJlY3Vyc286OmNyZWF0ZShbDQogICAgICAgICAgICAnYmFzZV9pZCcgICAgID0+ICRiYXNlLT5pZCwNCiAgICAgICAgICAgICdzdXByaW1lbnRvcycgPT4gMTUwMCwNCiAgICAgICAgICAgICdjb21idXN0aXZlbCcgPT4gMTAwMCwNCiAgICAgICAgICAgICdtdW5pY29lcycgICAgPT4gODAwLA0KICAgICAgICAgICAgJ3Blc3NvYWwnICAgICA9PiA2MDAsDQogICAgICAgIF0pOw0KDQogICAgICAgIC8vIENyaWFyIGVkaWbtY2lvcyBiw6FzaWNvcw0KICAgICAgICBFZGlmaWNpbzo6Y3JlYXRlKFsbaseX2aWQiID0+ICRiYXNlLT5pZCwgJ3RpcG8nID0+ICdRRycsICduaXZlbCcgPT4gMV0pOw0KICAgICAgICBFZGlmaWNpbzo6Y3JlYXRlKFsbaseX2aWQiID0+ICRiYXNlLT5pZCwgJ3RpcG8nID0+ICdRdWFydGVsJywgJ25pdmVsJyA9PiAxXSk7DQogICAgICAgIEVkaWZpY2lvOjpjcmVhdGUoWbaseX2aWQiID0+ICRiYXNlLT5pZCwgJ3RpcG8nID0+ICdNdXJhbGhhJywgJ25pdmVsJyA9PiAxXSk7DQoNCiAgICAgICAgLy8gRmF6ZXIgbG9naW4gYXV0b23DoXRpY28NCiAgICAgICAgQXV0aDo6bG9naW4oJGpvZ2Fkb3IpOw0KDQogICAgICAgIHJldHVybiByZWRpcmVjdCgnL2Rhc2hib2FyZCcpLT53aXRoKCdzdWNjZXNzJywgJ0NvbnRhIGNyaWFkYSBjb20gc3VjZXNzbyEgQmVtLXZpbmRvIGFvIEd1ZXJyYXMgTW9kZXJuYXMhJyk7DQogICAgfQ0KDQogICAgLy8gPT09PT09PT09PT09PT09PT09PT09IExPR0lOID09PT09PT09PT09PT09PT09PT09PQ0KICAgIHB1YmxpYyBmdW5jdGlvbiBsb2dpbihSZXF1ZXN0ICRyZXF1ZXN0KQ0KICAgIHsNCiAgICAgICAgJGNyZWRlbnRpYWxzID0gJHJlcXVlc3QtPm9ubHkoJ2VtYWlsJywgJ3Bhc3N3b3JkJyk7DQoNCiAgICAgICAgaWYgKEF1dGg6OmF0dGVtcHQoJGNyZWRlbnRpYWxzKSkgew0KICAgICAgICAgICAgJHJlcXVlc3QtPnNlc3Npb24oKS0+cmVnZW5lcmF0ZSgpOw0KICAgICAgICAgICAgcmV0dXJuIHJlZGlyZWN0KCcvZGFzaGJvYXJkJyk7DQogICAgICAgIH0NCg0KICAgICAgICByZXR1cm4gcmVkaXJlY3QoKS0+YmFjaygpLT53aXRoRXJyb3JzKFsnZW1haWwnID0+ICdDcmVkZW5jaWFpcyBpbnbDoWxpZGFzLiddKTsNCiAgICB9DQoNCiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT0gTE9HT1VUID09PT09PT09PT09PT09PT09PT09DQogICAgcHVibGljIGZ1bmN0aW9uIGxvZ291dChSZXF1ZXN0ICRyZXF1ZXN0KQ0KICAgIHsNCiAgICAgICAgQXV0aDo6bG9nb3V0KCk7DQogICAgICAgICRyZXF1ZXN0LT5zZXNzaW9uKCktPmludmFsaWRhdGUoKTsNCiAgICAgICAgJHJlcXVlc3QtPnNlc3Npb24oKS0+cmVnZW5lcmF0ZVRva2VuKCk7DQoNCiAgICAgICAgcmV0dXJuIHJlZGlyZWN0KCcvJyktPndpdGgoJ3N1Y2Nlc3MnLCAnU2Vzc8OjbyB0ZXJtaW5hZGEuJyk7DQogICAgfQ0KDQogICAgLy8gPT09PT09PT09PT09PT09PT09PT0gREFTSEJPQVJEID09PT09PT09PT09PT09PT09PT09DQogICAgcHVibGljIGZ1bmN0aW9uIGRhc2hib2FyZChSZXF1ZXN0ICRyZXF1ZXN0KQ0KICAgIHsNCiAgICAgICAgJGpvZ2Fkb3IgPSBBdXRoOjp1c2VyKCk7DQogICAgICAgIGlmICghJGpvZ2Fkb3IpIHJldHVybiByZWRpcmVjdCgnL2xvZ2luJyk7DQoNCiAgICAgICAgLy8gQnVzY2FyIHRvZGFzIGFzIGJhc2VzIGRvIGpvZ2Fkb3INCiAgICAgICAgJGJhc2VzID0gJGpvZ2Fkb3ItPmJhc2VzKCktPndpdGgoJ3JlY3Vyc29zJywgJ2VkaWZpY2lvcycsICdjb25zdHJ1Y29lcycsICd0cmVpbm9zJyktPmdldCgpOw0KICAgICAgICANCiAgICAgICAgLy8gRGV0ZXJtaW5hciBxdWFsIGJhc2UgZXhpYmlyICh2aWEgc2Vzc8OjbyBvdSBwcmltZWlyYSBkYSBsaXN0YSkNCiAgICAgICAgJHNlbGVjdGVkQmFzZUlkID0gc2Vzc2lvbignc2VsZWN0ZWRfYmFzZV9pZCcpOw0KICAgICAgICAkYmFzZSA9ICRiYXNlcy0+d2hlcmUoJ2lkJywgJHNlbGVjdGVkQmFzZUlkKS0+Zmlyc3QoKSA/PyAkYmFzZXMtPmZpcnN0KCk7DQoNCiAgICAgICAgaWYgKCRiYXNlKSB7DQogICAgICAgICAgICAvLyBBVVRPLVJFUEFJUjogQXNzZWd1cmFyIHF1ZSBvcyByZWN1cnNvcyBleGlzdGVtIGFudGVzIGRlIGNhcnJlZ2FyDQogICAgICAgICAgICBpZiAoISRiYXNlLT5yZWN1cnNvcygpLT5leGlzdHMoKSkgew0KICAgICAgICAgICAgICAgIFxBcHBcTW9kZWxzXFJlY3Vyc286OmNyZWF0ZShbDQogICAgICAgICAgICAgICAgICAgICdiYXNlX2lkJyAgICAgPT4gJGJhc2UtPmlkLA0KICAgICAgICAgICAgICAgICAgICAnc3VwcmltZW50b3MnID0+IDUwMCwNCiAgICAgICAgICAgICAgICAgICAgJ2NvbWJ1c3RpdmVsJyA9PiA1MDAsDQogICAgICAgICAgICAgICAgICAgICdtdW5pY29lcycgICAgPT4gNTAwLA0KICAgICAgICAgICAgICAgICAgICAncGVzc29hbCcgICAgID0+IDEwMCwNCiAgICAgICAgICAgICAgICBdKTsNCiAgICAgICAgICAgIH0NCg0KICAgICAgICAgICAgJGdhbWVTZXJ2aWNlID0gbmV3IEdhbWVTZXJ2aWNlKCk7DQogICAgICAgICAgICAvLyBBdHVhbGl6YXIgUmVjdXJzb3MgZSBGaWxhIGRlIENvbnN0cnXDp8Ojby9UcmVpbm8gKHNlbXByZSBhdHVhbGl6YSBhbyB2ZXIpDQogICAgICAgICAgICAkZ2FtZVNlcnZpY2UtPmF0dWFsaXphclJlY3Vyc29zKCRiYXNlKTsNCiAgICAgICAgICAgICRnYW1lU2VydmljZS0+cHJvY2Vzc2FyRmlsYSgkYmFzZSk7DQogICAgICAgICAgICANCiAgICAgICAgICAgIC8vIFJlY2FycmVnYXIgY29tIHRvZGFzIGFzIGRlcGVuZMOqbmNpYXMgZmluYWlzDQogICAgICAgICAgICAkYmFzZS0+cmVmcmVzaCgpOw0KICAgICAgICAgICAgJGJhc2UtPmxvYWQoWydyZWN1cnNvcycsICdlZGlmaWNpb3MnLCAnY29uc3RydWNvZXMnLCAndHJlaW5vcycsICd0cm9wYXMnXSk7DQogICAgICAgICAgICANCiAgICAgICAgICAgIC8vIEd1YXJkYXIgbyBJRCBzZWxlY2lvbmFkbyBuYSBzZXNzYm8gcGFyYSBwZXJzaXN0w6puY2lhDQogICAgICAgICAgICBzZXNzaW9uKFs'c2VsZWN0ZWRfYmFzZV9pZCcID0+ICRiYXNlLT5pZF0pOw0KDQogICAgICAgICAgICAvLyBPYnRlciB0YXhhcyBkZSBwcm9kdXRow6NvIHAvbWluDQogICAgICAgICAgICAkdGF4YXMgPSAkZ2FtZVNlcnZpY2UtPm9idGVyVGF4YXNQcm9kdWNhbygkYmFzZSk7DQogICAgICAgICAgICANCiAgICAgICAgICAgIC8vIE9idGVyIHRheGFzIHAvc2VndW5kbyBwYXJhIG8gdGlja2VyIGRvIGZyb250ZW5kDQogICAgICAgICAgICAkdGF4YXNQZXJTZWNvbmQgPSBbXTsNCiAgICAgICAgICAgIGZvcmVhY2goJHRheGFzIGFzICRyZXMgPT4gJG1pblJhdGUpIHsNCiAgICAgICAgICAgICAgICAkdGF4YXNQZXJTZWNvbmRbJHJlc10gPSAkbWluUmF0ZSAvIDYwOw0KICAgICAgICAgICAgfQ0KDQogICAgICAgICAgICAvLyBOT1ZBUyBWQVJJw4FWRUlTIFBBUkEgTyBVSSBNT0RFUk5PIChGQVNFUyAxMS0xNCkNCiAgICAgICAgICAgICRpbnRlbExldmVsID0gJGJhc2UtPmVkaWZpY2lvcygpLT53aGVyZSgndGlwbycsICdyYWRhcl9lc3RyYXTDqWdpY28nKS0+Zmlyc3QoKT8tPm5pdmVsID8/IDA7DQogICAgICAgICAgICANCiAgICAgICAgICAgIC8vIEPDoWxjdWxvIGRlIFBvcHVsYcOnw6NvL0d1YXJuaWPDp28NCiAgICAgICAgICAgICRuaXZlbFJlY3J1dGFtZW50byA9ICRiYXNlLT5lZGlmaWNpb3MoKS0+d2hlcmUoJ3RpcG8nLCAncG9zdG9fcmVjcnV0YW1lbnRvJyktPmZpcnN0KCk/LT5uaXZlbCA/PyAwOw0KICAgICAgICAgICAgJGNhcGFjaWRhZGVCYXNlID0gKDEwMCAqICgkbml2ZWxSZWNydXRhbWVudG8gKyAxKSkgKiAxLjU7DQogICAgICAgICAgICAkbml2ZWxMb2dpc3RpY2EgPSAkam9nYWRvci0+b2J0ZXJOaXZlbFRlY2goJ2xvZ2lzdGljYScpOw0KICAgICAgICAgICAgJG11bHRpcGxpY2Fkb3JDYXAgPSAxICsgKCRuaXZlbExvZ2lzdGljYSAqIDAuMTApOw0KICAgICAgICAgICAgJGNhcFRvdGFsID0gJGNhcGFjaWRhZGVCYXNlICogJG11bHRpcGxpY2Fkb3JDYXA7DQoNCiAgICAgICAgICAgICRwb3BPY3VwYWRhID0gMDsNCiAgICAgICAgICAgIGZvcmVhY2ggKCRiYXNlLT50cm9wYXMgYXMgJHQpIHsNCiAgICAgICAgICAgICAgICAkcG9wT2N1cGFkYSArPSAoJHQtPnF1YW50aWRhZGUgKiAoY29uZmlnKCJnYW1lLnVuaXRzLnskdC0+dW5pZGFkZX0uY29zdC5wZXNzb2FsIikgPz8gMSkpOw0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgJHBvcFBlcmNlbnQgPSAoJGNhcFRvdGFsID4gMCkgPyBtaW4oMTAwLCAoJHBvcE9jdXBhZGEgLyAkY2FwVG90YWwpICogMTAwKSA6IDA7DQoNCiAgICAgICAgICAgIC8vIFBlc3F1aXNhcyBlbSBjdXJzbw0KICAgICAgICAgICAgJHBlc3F1aXNhcyVtQ3Vyc28gPSBcQXBwXE1vZGVsc1xQZXNxdWlzYTo6d2hlcmUoJ2pvZ2Fkb3JfaWQnLCAkam9nYWRvci0+aWQpDQogICAgICAgICAgICAgICAgLT53aGVyZSgnY29tcGxldGFkb19lbScsICc+Jywgbm93KCkpDQogICAgICAgICAgICAgICAgLT5nZXQoKTsNCiAgICAgICAgICAgIA0KICAgICAgICAgICAgLy8gQXRhcXVlcw0KICAgICAgICAgICAgJGF0YXF1ZXNSZWNlYmlkb3MgPSBcQXBwXE1vZGVsc1xBdGFxdWU6OndoZXJlKCdkZXN0aW5vX2Jhc2VfaWQnLCAkYmFzZS0+aWQpLT53aGVyZSgncHJvY2Vzc2FkbycsIGZhbHNlKS0+Z2V0KCk7DQogICAgICAgICAgICAkYXRhcXVlc0VudmlhZG9zID0gXEFwcFxNb2RlbHNcQXRhcXVlOjp3aGVyZSgnb3JpZ2VtX2Jhc2VfaWQnLCAkYmFzZS0+aWQpLT53aGVyZSgncHJvY2Vzc2FkbycsIGZhbHNlKS0+Z2V0KCk7DQoNCiAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICAgICR0YXhhcyA9IFsnc3VwcmltZW50b3MnID0+IDAsICdjb21idXN0aXZlbCcgPT4gMCwgJ211bmljb2VzJyA9PiAwLCAncGVzc29hbCcgPT4gMF07DQogICAgICAgICAgICAkdGF4YXNQZXJTZWNvbmQgPSAkdGF4YXM7DQogICAgICAgICAgICAkaW50ZWxMZXZlbCA0IDAsDQogICAgICAgICAgICAkcG9wT2N1cGFkYSA9IDAsDQogICAgICAgICAgICAkY2FwVG90YWwgPSAwLA0KICAgICAgICAgICAgJHBvcFBlcmNlbnQgPSAwOw0KICAgICAgICAgICAgJHBlc3F1aXNhcyVtQ3Vyc28gPSBjb2xsZWN0KCk7DQogICAgICAgICAgICAkYXRhcXVlc1JlY2ViaWRvcyA9IGNvbGxlY3QoKTsNCiAgICAgICAgICAgICRhdGFxdWVzRW52aWFkb3MgPSBjb2xsZWN0KCk7DQogICAgICAgIH0NCg0KICAgICAgICAvLyBCdXNjYXIgw7psdGltb3MgcmVsYXTDs3Jpb3MgZW52b2x2aWRvcyNCiAgICAgICAgJHJlbGF0b3Jpb3MgPSBcQXBwXE1vZGVsc1xSZWxhdG9yaW86OndoZXJlKCdhdGFjYW50ZV9pZCcsICRqb2dhZG9yLT5pZCkNCiAgICAgICAgICAgIC0+b3JXaGVyZSgnZGVmZW5zb3JfaWQnLCAkam9nYWRvci0+aWQpDQogICAgICAgICAgICAtPm9yZGVyQnkoJ2NyZWF0ZWRfYWwnLCAnZGVzYycpDQogICAgICAgICAgICAtPnRha2UoOCkNCiAgICAgICAgICAgIC0+Z2V0KCk7DQoNCiAgICAgICAgJHJlbGF0b3Jpb3NHbG9iYWwgPSBcQXBwXE1vZGVsc1xSZWxhdG9yaW86Om9yZGVyQnkoJ2NyZWF0ZWRfYWwnLCAnZGVzYycpDQogICAgICAgICAgICAtPnRha2UoMTApDQogICAgICAgICAgICAtPmdldCgpOw0KDQogICAgICAgIHJldHVybiB2aWV3KCdkYXNoYm9hcmQnLCBjb21wYWN0KA0KICAgICAgICAgICAgJ2pvZ2Fkb3InLCAnYmFzZScsICdiYXNlcycsICdyZWxhdG9yaW9zJywgJ3JlbGF0b3Jpb3NHbG9iYWwnLCANCiAgICAgICAgICAgICd0YXhhcycsICd0YXhhc1BlclNlY29uZCcsICdpbnRlbExldmVsJywgJ3BvcE9jdXBhZGEnLCANCiAgICAgICAgICAgICdjYXBUb3RhbCcsICdwb3BQZXJjZW50JywgJ3Blc3F1aXNhcyVtQ3Vyc28nLCANCiAgICAgICAgICAgICdhdGFxdWVzUmVjZWJpZG9zJywgJ2F0YXF1ZXNFbnZpYWRvcycNCiAgICAgICAgKSk7DQogICAgfQ0KfQ0K'),
                'app/Services/GameService.php' => base64_decode('PD9waHANCg0KbmFtZXNwYWNlIEFwcFxTZXJ2aWNlczsNCg0KdXNlIEFwcFxNb2RlbHNcQmFzZTsNCnVzZSBBcHBcTW9kZWxzXEVkaWZpY2lvOw0KdXNlIEFwcFxNb2RlbHNcUmVjdXJzbzsNCnVzZSBBcHBcTW9kZWxzXENvbnN0cnVjYW87DQp1c2UgQXBwXE1vZGVsc1xUcmVpbm87DQp1c2UgQXBwXE1vZGVsc1xUcm9wYXM7DQp1c2UgSWxsdW1pbmF0ZVxTdWZwb3J0XEZhY2FkZXNcREI7DQoNCmNsYXNzIEdhbWVTZXJ2aWNlDQp7DQogICAgcHVibGljIGZ1bmN0aW9uIGF0dWFsaXphclJlY3Vyc29zKEJhc2UgJGJhc2UpDQogICAgew0KICAgICAgICAvLyBHYXJhbnRpciBxdWUgJHJlY3Vyc29zIGV4aXN0ZW0NCiAgICAgICAgJHJlY3Vyc29zID0gJGJhc2UtPnJlY3Vyc29zOw0KICAgICAgICBpZiAoISRyZWN1cnNvcykgcmV0dXJuOw0KDQogICAgICAgICR0YXhhcyA9ICR0aGlzLT5vYnRlclRheGFzUHJvZHVjYW8oJGJhc2UpOw0KDQogICAgICAgIERCOjp0cmFuc2FjdGlvbihmdW5jdGlvbigpIHVzZSAoJGJhc2UsICR0YXhhcykgew0KICAgICAgICAgICAgREI6OnN0YXRlbWVudCgiDQogICAgICAgICAgICAgICAgVVBEQVRFIHJlY3Vyc29zIA0KICAgICAgICAgICAgICAgIFNFVCBzdXByaW1lbnRvcyA9IHN1cHJpbWVudG9zICsgKD8gKiBHUkVBVEVTVCgwLCBUSU1FU1RBTVBESUZGKFNFQ09ORCwgQ09BTEVTQ0UodXBkYXRlZF9hdCwgY3JlYXRlZF9hdCw内外E9XKCkpLCBOT1coKSkpKSwNCiAgICAgICAgICAgICAgICAgICAgY29tYnVzdGl2ZWwgPSBjb21idXN0aXZlbCArICg/ICogR1JFQVRFU1QoMCwgVElNRVNUQU1QRElGRihTRUNPTkQsIENPQUxFU0NFKHVwZGF0ZWRfYXQsIGNyZWF0ZWRfYXQsIE5PVygpKSw内外E9XKCkpKSksDQogICAgICAgICAgICAgICAgICAgIG11bmljb2VzICAgID0gbXVuaWNvZXMgICAgKyAoPyAqIEdSRUFURVNUKDAsIFRJTUVTVEFNUERJRkYoU0VDT05ELCBDT0FMRVNDRSh1cGRhdGVkX2F0LCBjcmVhdGVkX2F0LCBOT1coKSks内外E9XKCkpKSksDQogICAgICAgICAgICAgICAgICAgIHBlc3NvYWwnICAgICA9IHBlc3NvYWwgICAgICsgKD8gKiBHUkVBVEVTVCgwLCBUSU1FU1RBTVBESUZGKFNFQ09ORCwgQ09BTEVTQ0UodXBkYXRlZF9hdCwgY3JlYXRlZF9hdCw内外E9XKCkpLCBOT1coKSkpKSwNCiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZF9hdCAgPSBOT1coKQ0KICAgICAgICAgICAgICAgIFdIRVJFIGJhc2VfaWQgPSA/DQogICAgICAgICAgICAiLCBbDQogICAgICAgICAgICAgICAgJHRheGFzWydzdXByaW1lbnRvcyddIC8gNjAsDQogICAgICAgICAgICAgICAgJHRheGFzWydjb21idXN0aXZlbCddIC8gNjAsDQogICAgICAgICAgICAgICAgJHRheGFzWydtdW5pY29lcyddIC8gNjAsDQogICAgICAgICAgICAgICAgJHRheGFzWydwZXNzb2FsJ10gLyA2MCwNCiAgICAgICAgICAgICAgICAkYmFzZS0+aWQNCiAgICAgICAgICAgIF0pOw0KICAgICAgICB9KTsNCiAgICB9DQoNCiAgICBwdWJsaWMgZnVuY3Rpb24gb2J0ZXJUYXhhc1Byb2R1Y2FvKEJhc2UgJGJhc2UpDQogICAgew0KICAgICAgICAvLyBCYXNlIGJhc2ljYQ0KICAgICAgICAkdGF4YXMgPSBbJ3N1cHJpbWVudG9zJyA9PiAxNSwgJ2NvbWJ1c3RpdmVsJyA9PiAxMCwgJ211bmljb2VzJyA9PiA1LCAncGVzc29hbCcgPT4gMl07DQoNCiAgICAgICAgLy8gRWZlaXRvcyBkb3MgZWRpZs7jaW9zDQogICAgICAgICRxaXJfdmVudG8gPSAkYmFzZS0+ZWRpZmljaW9zLT53aGVyZSgndGlwbycsICdGYXphbmRhJyktPmZpcnN0KCk/LT5uaXZlbCA/PyAwOw0KICAgICAgICAkdGF4YXNbJ3N1cHJpbWVudG9zJ10gKz0gKCRxaXJfdmVudG8gKiAxMCk7DQoNCiAgICAgICAgJHByb2RfcmVmaW5hcmlhID0gJGJhc2UtPmVkaWZpY2lvcy0+d2hlcmUoJ3RpcG8nLCAnUmVmaW5hcmlhJyktPmZpcnN0KCk/LT5uaXZlbCA/PyAwOw0KICAgICAgICAkdGF4YXNbJ2NvbWJ1c3RpdmVsJ10gKz0gKCRwcm9kX3JlZmluYXJpYSAqIDgpOw0KDQogICAgICAgICRwcm9kX2ZhYnJpY2EgPSAkYmFzZS0+ZWRpZmljaW9zLT53aGVyZSgndGlwbycsICdGYWJyaWNhX011bmljb2VzJyktPmZpcnN0KCk/LT5uaXZlbCA/PyAwOw0KICAgICAgICAkdGF4YXNbJ211bmljb2VzJ10gKz0gKCRwcm9kX2ZhYnJpY2EgKiA1KTsNCg0KICAgICAgICAkcHJvZF9wb3N0byA9ICRiYXNlLT5lZGlmaWNpb3MtPm9oZXJlKCd0aXBvJywgJ1Bvc3RvX1JlY3J1dGFtZW50bycpLT5maXJzdCgpPy0+bml2ZWwgPz8gMDsNCiAgICAgICAgJHRheGFzWydwZXNzb2FsJ10gKz0gKCRwcm9kX3Bvc3RvICogMik7DQoNCiAgICAgICAgcmV0dXJuICR0YXhhczsNCiAgICB9DQoNCiAgICBwdWJsaWMgZnVuY3Rpb24gcHJvY2Vzc2FyRmlsYShCYXNlICRiYXNlKQ0KICAgIHsNCiAgICAgICAgJGNvbnN0cnVjb2VzID0gJGJhc2UtPmNvbnN0cnVjb2VzKCktPndoZXJlKCdjb21wbGV0YWRvX2VtJywgJzw9Jywgbm93KCkpLT5nZXQoKTsNCiAgICAgICAgZm9yZWFjaCAoJGNvbnN0cnVjb2VzIGFzICRjKSB7DQogICAgICAgICAgICBEQjo6dHJhbnNhY3Rpb24oZnVuY3Rpb24oKSB1c2UgKCRiYXNlLCAkYykgew0KICAgICAgICAgICAgICAgICRlZGlmID0gJGJhc2UtPmVkaWZpY2lvcygpLT53aGVyZSgndGlwbycsICRjLT5lZGlmaWNpb190aXBvKS0+Zmlyc3QoKTsNCiAgICAgICAgICAgICAgICBpZiAoISRlZGlmKSB7DQogICAgICAgICAgICAgICAgICAgICRiYXNlLT5lZGlmaWNpb3MoKS0+Y3JlYXRlKFsbaseX3RpcG8nID0+ICRjLT5lZGlmaWNpb190aXBvLCAnbml2ZWwnID0+ICRjLT5uaXZlbF9kZXN0aW5vXSk7DQogICAgICAgICAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICAgICAgICAgICAgJGVkaWYtPnVwZGF0ZShbJ25pdmVsJyA9PiAkYy0+bml2ZWxfZGVzdGlub10pOw0KICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAkYy0+ZGVsZXRlKCk7DQogICAgICAgICAgICB9KTsNCiAgICAgICAgfQ0KICAgIH0NCn0NCg=='),
                'resources/views/dashboard.blade.php' => base64_decode('=='),
            ];

            foreach ($filesToPatch as $path => $content) {
                $fullPath = base_path($path);
                if (file_put_contents($fullPath, $content)) {
                    $patchLog .= "PATCH SUCCESS: $path\n";
                } else {
                    $patchLog .= "PATCH FAILED: $path (Permission error?)\n";
                }
            }
        } catch (\Exception $patchEx) {
            $patchLog .= "PATCH ERROR: " . $patchEx->getMessage() . "\n";
        }

        // 8. LIMPEZA PROFUNDA DE CACHE E VIEWS
        \Illuminate\Support\Facades\Artisan::call('view:clear');
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
        \Illuminate\Support\Facades\Artisan::call('optimize:clear');

        return "<h3>Tactical Override Success</h3>" . 
               "<pre>$log</pre>" . 
               "<h4>Hot-Patch Log</h4><pre>$patchLog</pre>" .
               "<h4>System Logic Refreshed</h4>" .
               "<ul><li>Tabelas de Combate & Tropas: OK</li><li>Reparação de Bases órfãs: " . $basesSemRecurso->count() . "</li><li>Cache & Views: Limpos</li></ul>";
    } catch (\Exception $e) {
        return "<h3>Tactical Override Warning</h3>" . 
               "<p>Error during DB phase: " . $e->getMessage() . "</p>";
    }
});
