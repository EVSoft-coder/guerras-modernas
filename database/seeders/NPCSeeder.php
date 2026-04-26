<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Jogador;
use App\Models\Base;
use App\Models\Recurso;
use Illuminate\Support\Facades\Hash;

class NPCSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Criar Jogador NPC (Célula Rebelde)
        $rebel = Jogador::firstOrCreate(
            ['username' => 'REBELS'],
            [
                'email' => 'rebels@guerras.com',
                'password' => Hash::make('no-login-' . uniqid()),
            ]
        );

        // 2. Gerar Bases Rebeldes em locais estratégicos
        $locations = [
            ['nome' => 'Posto Avançado Rebelde', 'x' => 505, 'y' => 505],
            ['nome' => 'Depósito de Armas Insurrectas', 'x' => 495, 'y' => 510],
            ['nome' => 'Acampamento Paramilitar', 'x' => 510, 'y' => 490],
            ['nome' => 'Estação de Radar Rebelde', 'x' => 480, 'y' => 480],
            ['nome' => 'Complexo de Treino Guerrilha', 'x' => 520, 'y' => 520],
        ];

        foreach ($locations as $loc) {
            $base = Base::firstOrCreate(
                ['coordenada_x' => $loc['x'], 'coordenada_y' => $loc['y']],
                [
                    'jogador_id' => $rebel->id,
                    'nome' => $loc['nome'],
                    'qg_nivel' => rand(3, 8),
                    'muralha_nivel' => rand(1, 4),
                    'loyalty' => 100,
                ]
            );

            // Adicionar Recursos à base NPC
            Recurso::firstOrCreate(['base_id' => $base->id], [
                'suprimentos' => rand(5000, 15000),
                'combustivel' => rand(3000, 8000),
                'municoes' => rand(10000, 25000),
                'pessoal' => rand(1000, 5000),
            ]);
        }

        $this->command->info('NPC_REBEL_SPAWN: Células insurrectas infiltradas no mapa tático.');
    }
}
