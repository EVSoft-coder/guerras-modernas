<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Jogador;
use App\Models\Base;
use App\Models\Recurso;
use App\Models\Edificio;
use Illuminate\Support\Facades\Hash;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        // Limpar tabelas para evitar conflitos
        Jogador::truncate();
        Base::truncate();

        // Criar Jogador Administrador
        $jogador = Jogador::create([
            'username' => 'admin',
            'email' => 'admin@guerras.com',
            'password' => Hash::make('speed123'),
        ]);

        // Criar Base Principal
        $base = Base::create([
            'jogador_id' => $jogador->id,
            'nome' => 'Fortaleza Alpha',
            'coordenada_x' => 500,
            'coordenada_y' => 500,
            'qg_nivel' => 10,
            'muralha_nivel' => 5,
        ]);

        // Criar Recursos
        Recurso::create([
            'base_id' => $base->id,
            'suprimentos' => 50000,
            'combustivel' => 30000,
            'municoes' => 20000,
            'pessoal' => 10000,
        ]);

        // Criar Edifícios Produtores
        Edificio::create(['base_id' => $base->id, 'tipo' => 'mina_suprimentos', 'nivel' => 15]);
        Edificio::create(['base_id' => $base->id, 'tipo' => 'refinaria', 'nivel' => 12]);
        Edificio::create(['base_id' => $base->id, 'tipo' => 'fabrica_municoes', 'nivel' => 10]);
        Edificio::create(['base_id' => $base->id, 'tipo' => 'posto_recrutamento', 'nivel' => 8]);

        $this->command->info('Speed Mode Seeder concluído! User: admin | Pass: speed123');
    }
}
