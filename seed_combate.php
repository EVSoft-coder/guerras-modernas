<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Jogador;
use App\Models\Base;
use App\Models\Recurso;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

DB::transaction(function() {
    $jogador = Jogador::firstOrCreate(['email' => 'alvo_treino@evsoft.pt'], [
        'username' => 'Alvo_Treino',
        'password' => Hash::make('password123'),
        'xp' => 100,
        'nivel' => 1,
        'cargo' => 'Inimigo'
    ]);

    for ($i = 1; $i <= 5; $i++) {
        $offsetX = rand(-4, 4);
        $offsetY = rand(-4, 4);
        if ($offsetX == 0 && $offsetY == 0) $offsetX = 1;
        
        $base = Base::firstOrCreate(['nome' => 'Base Inimiga #' . $i], [
            'jogador_id' => $jogador->id,
            'coordenada_x' => 500 + $offsetX,
            'coordenada_y' => 500 + $offsetY,
            'qg_nivel' => 1,
            'muralha_nivel' => rand(1, 3)
        ]);
        
        if (!$base->recursos()->exists()) {
            Recurso::create([
                'base_id' => $base->id,
                'suprimentos' => 5000,
                'combustivel' => 5000,
                'municoes' => 5000,
                'pessoal' => 1000
            ]);
        }
    }
});

echo "ALVOS DE TREINO POSICIONADOS NO SETOR [500:500].\n";
