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
        // 1. Atualizar Tabela 'edificios'
        if (Schema::hasTable('edificios')) {
            DB::table('edificios')
                ->where('tipo', 'complexo_residencial')
                ->update(['tipo' => 'housing']);
        }

        // 2. Atualizar Tabela de Construções (construcoes ou construcaos)
        $table = Schema::hasTable('construcoes') ? 'construcoes' : (Schema::hasTable('construcaos') ? 'construcaos' : null);
        if ($table) {
            $column = Schema::hasColumn($table, 'edificio_tipo') ? 'edificio_tipo' : (Schema::hasColumn($table, 'tipo') ? 'tipo' : null);
            if ($column) {
                DB::table($table)
                    ->where($column, 'complexo_residencial')
                    ->update([$column => 'housing']);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('edificios')) {
            DB::table('edificios')
                ->where('tipo', 'housing')
                ->update(['tipo' => 'complexo_residencial']);
        }

        $table = Schema::hasTable('construcoes') ? 'construcoes' : (Schema::hasTable('construcaos') ? 'construcaos' : null);
        if ($table) {
            $column = Schema::hasColumn($table, 'edificio_tipo') ? 'edificio_tipo' : (Schema::hasColumn($table, 'tipo') ? 'tipo' : null);
            if ($column) {
                DB::table($table)
                    ->where($column, 'housing')
                    ->update([$column => 'complexo_residencial']);
            }
        }
    }
};
