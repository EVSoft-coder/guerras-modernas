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
        Schema::table('bases', function (Blueprint $table) {
            if (!Schema::hasColumn('bases', 'loyalty_updated_at')) {
                $table->timestamp('loyalty_updated_at')->nullable();
            }
        });

        // Inserir a unidade de conquista (Estilo "Nobre")
        DB::table('unit_types')->updateOrInsert(
            ['name' => 'Oficial de Inteligência'],
            [
                'building_type' => 'hq',
                'attack' => 30,
                'defense' => 100,
                'speed' => 35.0, // Unidade muito lenta!
                'carry_capacity' => 0,
                'cost_suprimentos' => 40000,
                'cost_municoes' => 50000,
                'cost_combustivel' => 40000,
                'build_time' => 10800, // 3 horas
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bases', function (Blueprint $table) {
            if (Schema::hasColumn('bases', 'loyalty_updated_at')) {
                $table->dropColumn('loyalty_updated_at');
            }
        });

        DB::table('unit_types')->where('name', 'Oficial de Inteligência')->delete();
    }
};
