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
                'name' => 'Infantaria',
                'building_type' => BuildingType::QUARTEL,
                'attack' => 10,
                'defense' => 15,
                'speed' => 10.0,
                'carry_capacity' => 20,
                'cost_suprimentos' => 100,
                'cost_municoes' => 20,
                'cost_combustivel' => 0,
                'build_time' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Veículo leve (APC)',
                'building_type' => BuildingType::FABRICA_MUNICOES,
                'attack' => 20,
                'defense' => 40,
                'speed' => 25.0,
                'carry_capacity' => 100,
                'cost_suprimentos' => 300,
                'cost_municoes' => 50,
                'cost_combustivel' => 100,
                'build_time' => 120,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tanque de Combate (MBT)',
                'building_type' => BuildingType::FABRICA_MUNICOES,
                'attack' => 150,
                'defense' => 100,
                'speed' => 20.0,
                'carry_capacity' => 50,
                'cost_suprimentos' => 800,
                'cost_municoes' => 200,
                'cost_combustivel' => 300,
                'build_time' => 600,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
