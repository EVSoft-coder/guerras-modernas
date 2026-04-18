<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Domain\Building\BuildingType;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('unit_types')->where('name', 'Infantaria')->update([
            'building_type' => BuildingType::QUARTEL
        ]);

        DB::table('unit_types')->where('name', 'LIKE', '%Veículo%')->update([
            'building_type' => BuildingType::FABRICA_MUNICOES
        ]);

        DB::table('unit_types')->where('name', 'LIKE', '%Tanque%')->update([
            'building_type' => BuildingType::FABRICA_MUNICOES
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('unit_types')->update(['building_type' => null]);
    }
};
