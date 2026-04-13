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
        // Update edificios table
        DB::table('edificios')
            ->where('tipo', 'complexo_residencial')
            ->update(['tipo' => 'housing']);

        // Update construcaos table
        if (Schema::hasTable('construcaos')) {
            DB::table('construcaos')
                ->where('edificio_tipo', 'complexo_residencial')
                ->update(['edificio_tipo' => 'housing']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('edificios')
            ->where('tipo', 'housing')
            ->update(['tipo' => 'complexo_residencial']);

        if (Schema::hasTable('construcaos')) {
            DB::table('construcaos')
                ->where('edificio_tipo', 'housing')
                ->update(['edificio_tipo' => 'complexo_residencial']);
        }
    }
};
