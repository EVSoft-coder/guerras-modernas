<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BaseController;

/**
 * TRIGGER V23: THE PURIFICATION TOTAL
 * Este script limpa absolutamente todos os resíduos de encoding.
 */

ini_set('default_charset', 'UTF-8');
mb_internal_encoding('UTF-8');
if (!headers_sent()) {
    header('Content-Type: text/html; charset=UTF-8');
}

Route::get('/mw-admin-trigger-99', function() {
    $log = "--- V23 TOTAL PURIFICATION ---\n";
    
    try {
        // A. Forçar Charset na Base de Dados e Conexão
        DB::statement("SET NAMES 'utf8mb4'");
        $log .= "DB: Charset utf8mb4 garantido.\n";
        
        // B. Limpar Caches
        Artisan::call('view:clear');
        Artisan::call('optimize:clear');
        
        // C. MAPEAMENTO DE LIMPEZA PROFUNDA (Cobrindo as 8 sequências detetadas)
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
            base_path('resources/views/welcome.blade.php')
        ];

        foreach($files as $f) {
            if(file_exists($f)) {
                $content = file_get_contents($f);
                $cleaned = strtr($content, $mapping);
                file_put_contents($f, $cleaned);
                $log .= "Ficheiro " . basename($f) . " purificado.\n";
            }
        }

        return "<h1>V23 SUCCESS</h1><pre>$log</pre><p>O Dashboard deve estar agora 100% limpo!</p>";
        
    } catch (\Exception $e) {
        return "<h1>ERRO V23</h1><pre>" . $e->getMessage() . "</pre>";
    }
});
