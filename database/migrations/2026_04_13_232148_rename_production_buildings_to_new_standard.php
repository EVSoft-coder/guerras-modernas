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
        $renames = [
            'factory' => 'mina_metal',
            'solar' => 'central_energia'
        ];

        // 1. Atualizar Tabela 'edificios'
        if (Schema::hasTable('edificios')) {
            foreach ($renames as $old => $new) {
                DB::table('edificios')->where('tipo', $old)->update(['tipo' => $new]);
            }
        }

        // 2. Atualizar Tabela de Construções
        $table = Schema::hasTable('construcoes') ? 'construcoes' : (Schema::hasTable('construcaos') ? 'construcaos' : null);
        if ($table) {
            $column = Schema::hasColumn($table, 'edificio_tipo') ? 'edificio_tipo' : (Schema::hasColumn($table, 'tipo') ? 'tipo' : null);
            if ($column) {
                foreach ($renames as $old => $new) {
                    DB::table($table)->where($column, $old)->update([$column => $new]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $renames = [
            'mina_metal' => 'factory',
            'central_energia' => 'solar'
        ];

        if (Schema::hasTable('edificios')) {
            foreach ($renames as $old => $new) {
                DB::table('edificios')->where('tipo', $old)->update(['tipo' => $new]);
            }
        }

        $table = Schema::hasTable('construcoes') ? 'construcoes' : (Schema::hasTable('construcaos') ? 'construcaos' : null);
        if ($table) {
            $column = Schema::hasColumn($table, 'edificio_tipo') ? 'edificio_tipo' : (Schema::hasColumn($table, 'tipo') ? 'tipo' : null);
            if ($column) {
                foreach ($renames as $old => $new) {
                    DB::table($table)->where($column, $old)->update([$column => $new]);
                }
            }
        }
    }
};
