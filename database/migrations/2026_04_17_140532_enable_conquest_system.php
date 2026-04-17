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
    public function run(): void
    {
        // 1. Garantir que loyalty existe (Fase 13 - Passo 1)
        if (!Schema::hasColumn('bases', 'loyalty')) {
            Schema::table('bases', function (Blueprint $table) {
                $table->integer('loyalty')->default(100);
            });
        }

        // 2. Adicionar Unidade Especial: Político (Fase 13 - Passo 2)
        DB::table('unit_types')->updateOrInsert(
            ['name' => 'Politico'],
            [
                'attack' => 5,
                'defense' => 5,
                'speed' => 1.0,
                'carry_capacity' => 0,
                'cost_suprimentos' => 10000,
                'cost_municoes' => 2000,
                'cost_combustivel' => 5000,
                'build_time' => 3600,
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
