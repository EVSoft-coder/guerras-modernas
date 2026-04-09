<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BaseController;

/**
 * TRIGGER V23.1: THE UNBLOCKABLE PURIFICATION
 * Ignora barreiras 403 e cura o servidor.
 */

// FORÇAR UTF-8
ini_set('default_charset', 'UTF-8');
mb_internal_encoding('UTF-8');
if (!headers_sent()) {
    header('Content-Type: text/html; charset=UTF-8');
}

// ROTA PÚBLICA DE EMERGÊNCIA
Route::get('/mw-admin-trigger-99', function() {
    $log = "--- V23.1 UNBLOCKABLE REPAIR ---\n";
    
    try {
        // 1. Forçar Conexão
        DB::statement("SET NAMES 'utf8mb4'");
        
        // 2. Mapeamento de Limpeza
        $mapping = [
            'ðŸ“¦' => '📦', 'â›½' => '⛽', 'ðŸš€' => '🚀', 'ðŸ‘¥' => '👥',
            'ðŸ —ï¸ ' => '🏗️', 'âœ…' => '✅', 'ðŸ•’' => '🕒',
            'TÃ TICAS' => 'TÁTICAS', 
            'TerritÃ³rio' => 'Território',
            'DESIGNAÃ‡ÃƒO' => 'DESIGNAÇÃO',
            'TECNOLÃ“GICA' => 'TECNOLÓGICA',
            'LOGÃ STICA' => 'LOGÍSTICA',
            'PRÃ“X.' => 'PRÓX.',
            'NÃ VEL' => 'NÍVEL',
            'Ã­' => 'í', 'Ã§' => 'ç', 'Ãµ' => 'õ', 'Ãª' => 'ê', 'Ã³' => 'ó', 'Ã¡' => 'á', 'Ã©' => 'é', 'Â½' => '½'
        ];

        $files = [
            base_path('resources/views/dashboard.blade.php'),
            base_path('resources/views/layouts/app.blade.php'),
            base_path('resources/views/welcome.blade.php'),
            base_path('routes/web.php')
        ];

        foreach($files as $f) {
            if(file_exists($f)) {
                $content = file_get_contents($f);
                $cleaned = strtr($content, $mapping);
                file_put_contents($f, $cleaned);
                $log .= "Limpando: " . basename($f) . "\n";
            }
        }

        Artisan::call('optimize:clear');
        Artisan::call('view:clear');

        return "<h1>V23.1 SUCCESS</h1><pre>$log</pre><p>Toda a interface deve estar agora purificada.</p>";
        
    } catch (\Exception $e) {
        return "<h1>ERRO V23.1</h1><pre>" . $e->getMessage() . "</pre>";
    }
});
