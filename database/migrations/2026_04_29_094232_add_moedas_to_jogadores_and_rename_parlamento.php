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
        // 1. Adicionar moedas ao jogador
        Schema::table('jogadores', function (Blueprint $table) {
            $table->bigInteger('moedas')->default(0)->after('pontos');
        });

        // 2. Renomear edíficio Parlamento para Academia Militar nos tipos
        DB::table('building_types')
            ->where('tipo', 'parlamento')
            ->update([
                'tipo' => 'academia_militar',
                'created_at' => now(), // Apenas para marcar o update
            ]);

        // 3. Atualizar Político para ser recrutado no HQ e exigir Academia
        // Nota: O building_type na tabela unit_types refere-se ao edifício onde é recrutado
        DB::table('unit_types')
            ->where('name', 'politico')
            ->update([
                'building_type' => 'hq',
            ]);

        // 4. Renomear edifícios já construídos de 'parlamento' para 'academia_militar'
        DB::table('edificios')
            ->where('tipo', 'parlamento')
            ->update(['tipo' => 'academia_militar']);
            
        // 5. Atualizar unit_queue e building_queue se houver referências
        DB::table('building_queue')
            ->where('type', 'parlamento')
            ->update(['type' => 'academia_militar']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jogadores', function (Blueprint $table) {
            $table->dropColumn('moedas');
        });

        DB::table('building_types')
            ->where('tipo', 'academia_militar')
            ->update(['tipo' => 'parlamento']);

        DB::table('unit_types')
            ->where('name', 'politico')
            ->update(['building_type' => 'parlamento']);

        DB::table('edificios')
            ->where('tipo', 'academia_militar')
            ->update(['tipo' => 'parlamento']);
            
        DB::table('building_queue')
            ->where('type', 'academia_militar')
            ->update(['type' => 'parlamento']);
    }
};
