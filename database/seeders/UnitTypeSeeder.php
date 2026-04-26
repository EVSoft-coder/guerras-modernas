<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Domain\Building\BuildingType;

class UnitTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \DB::table('unit_types')->truncate();
        \DB::table('unit_types')->insert([
            [
                'name' => 'Infantaria de Assalto',
                'building_type' => BuildingType::QUARTEL,
                'attack' => 10,
                'defense' => 20,
                'speed' => 10.0,
                'carry_capacity' => 25,
                'cost_suprimentos' => 50,
                'cost_municoes' => 10,
                'cost_combustivel' => 0,
                'build_time' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sniper de Elite',
                'building_type' => BuildingType::QUARTEL,
                'attack' => 45,
                'defense' => 5,
                'speed' => 12.0,
                'carry_capacity' => 5,
                'cost_suprimentos' => 150,
                'cost_municoes' => 80,
                'cost_combustivel' => 0,
                'build_time' => 120,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Engenheiro de Combate',
                'building_type' => BuildingType::QUARTEL,
                'attack' => 5,
                'defense' => 15,
                'speed' => 8.0,
                'carry_capacity' => 150, // Ótimo para transporte!
                'cost_suprimentos' => 100,
                'cost_municoes' => 20,
                'cost_combustivel' => 20,
                'build_time' => 60,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Blindado APC',
                'building_type' => BuildingType::FABRICA_MUNICOES,
                'attack' => 20,
                'defense' => 50,
                'speed' => 25.0,
                'carry_capacity' => 500, // Especialista em logística
                'cost_suprimentos' => 300,
                'cost_municoes' => 50,
                'cost_combustivel' => 150,
                'build_time' => 200,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tanque MBT Leopard',
                'building_type' => BuildingType::FABRICA_MUNICOES,
                'attack' => 180,
                'defense' => 120,
                'speed' => 20.0,
                'carry_capacity' => 80,
                'cost_suprimentos' => 1200,
                'cost_municoes' => 400,
                'cost_combustivel' => 500,
                'build_time' => 900,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Helicóptero de Ataque',
                'building_type' => 'aerodromo',
                'attack' => 250,
                'defense' => 80,
                'speed' => 60.0,
                'carry_capacity' => 30,
                'cost_suprimentos' => 2500,
                'cost_municoes' => 800,
                'cost_combustivel' => 1200,
                'build_time' => 1800,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Drone de Reconhecimento',
                'building_type' => 'radar_estrategico',
                'attack' => 0,
                'defense' => 1,
                'speed' => 100.0,
                'carry_capacity' => 0,
                'cost_suprimentos' => 500,
                'cost_municoes' => 50,
                'cost_combustivel' => 200,
                'build_time' => 300,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
