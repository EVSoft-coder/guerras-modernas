<?php

namespace Database\Seeders;

use App\Models\BuildingType;
use Illuminate\Database\Seeder;

class BuildingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['name' => 'Quartel General', 'base_production' => 0, 'production_type' => null, 'base_build_time' => 120],
            ['name' => 'Mina de Suprimentos', 'base_production' => 10, 'production_type' => 'suprimentos', 'base_build_time' => 60],
            ['name' => 'Refinaria de Combustível', 'base_production' => 8, 'production_type' => 'combustivel', 'base_build_time' => 80],
            ['name' => 'Fábrica de Munições', 'base_production' => 12, 'production_type' => 'municoes', 'base_build_time' => 90],
            ['name' => 'Mina de Metal', 'base_production' => 15, 'production_type' => 'metal', 'base_build_time' => 100],
            ['name' => 'Central de Energia', 'base_production' => 20, 'production_type' => 'energia', 'base_build_time' => 70],
            ['name' => 'Posto de Recrutamento', 'base_production' => 5, 'production_type' => 'pessoal', 'base_build_time' => 50],
            ['name' => 'Quartel', 'base_production' => 0, 'production_type' => null, 'base_build_time' => 120],
            ['name' => 'Perímetro Defensivo', 'base_production' => 0, 'production_type' => null, 'base_build_time' => 150],
            ['name' => 'Plataforma Habitacional', 'base_production' => 0, 'production_type' => null, 'base_build_time' => 45],
        ];

        foreach ($types as $type) {
            BuildingType::updateOrCreate(['name' => $type['name']], $type);
        }
    }
}
