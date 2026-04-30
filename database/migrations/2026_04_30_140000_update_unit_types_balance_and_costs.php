<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Atualizar custos e tempos para as unidades padrão
        // Isto garante que o EconomyService tenha valores reais na DB para calcular
        
        $units = [
            'Infantaria de Assalto' => [
                'cost_suprimentos' => 50,
                'cost_municoes' => 10,
                'cost_combustivel' => 0,
                'cost_metal' => 10,
                'build_time' => 30,
            ],
            'Sniper de Elite' => [
                'cost_suprimentos' => 150,
                'cost_municoes' => 80,
                'cost_combustivel' => 0,
                'cost_metal' => 40,
                'build_time' => 120,
            ],
            'Engenheiro de Combate' => [
                'cost_suprimentos' => 100,
                'cost_municoes' => 20,
                'cost_combustivel' => 20,
                'cost_metal' => 50,
                'build_time' => 60,
            ],
            'Blindado APC' => [
                'cost_suprimentos' => 300,
                'cost_municoes' => 50,
                'cost_combustivel' => 150,
                'cost_metal' => 400,
                'build_time' => 200,
            ],
            'Tanque MBT Leopard' => [
                'cost_suprimentos' => 1200,
                'cost_municoes' => 400,
                'cost_combustivel' => 500,
                'cost_metal' => 1500,
                'build_time' => 900,
            ],
            'Helicóptero de Ataque' => [
                'cost_suprimentos' => 2500,
                'cost_municoes' => 800,
                'cost_combustivel' => 1200,
                'cost_metal' => 2000,
                'build_time' => 1800,
            ],
            'Drone de Reconhecimento' => [
                'cost_suprimentos' => 500,
                'cost_municoes' => 50,
                'cost_combustivel' => 200,
                'cost_metal' => 100,
                'build_time' => 300,
            ],
            'Líder Político' => [
                'cost_suprimentos' => 40000,
                'cost_municoes' => 50000,
                'cost_combustivel' => 50000,
                'cost_metal' => 20000,
                'build_time' => 3600,
            ],
        ];

        foreach ($units as $name => $stats) {
            DB::table('unit_types')
                ->where('name', 'like', "%{$name}%")
                ->update($stats);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Não é necessário reverter dados específicos de balanço neste caso
    }
};
