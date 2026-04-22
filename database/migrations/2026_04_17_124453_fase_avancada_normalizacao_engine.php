<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // PASSO 1 - BUILDING TYPES
        if (!Schema::hasTable('building_types')) {
            Schema::create('building_types', function (Blueprint $table) {
                $table->id();
                $table->string('name', 50);
                $table->integer('base_production')->default(0);
                $table->string('production_type', 50)->nullable();
                $table->integer('base_build_time')->default(60);
                $table->timestamps();
            });
        }

        // PASSO 2 - Atualizar edificios
        if (Schema::hasTable('edificios') && !Schema::hasColumn('edificios', 'building_type_id')) {
            Schema::table('edificios', function (Blueprint $table) {
                $table->foreignId('building_type_id')->nullable()->constrained('building_types');
            });
        }

        // PASSO 3 - STORAGE CAPACITY
        if (Schema::hasTable('recursos') && !Schema::hasColumn('recursos', 'storage_capacity')) {
            Schema::table('recursos', function (Blueprint $table) {
                $table->integer('storage_capacity')->default(10000);
            });
        }

        // PASSO 6 - COORDENADAS (Normalização para x, y curto)
        if (Schema::hasTable('bases') && !Schema::hasColumn('bases', 'x')) {
            Schema::table('bases', function (Blueprint $table) {
                $table->integer('x')->default(0);
                $table->integer('y')->default(0);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bases', function (Blueprint $table) {
            $table->dropColumn(['x', 'y']);
        });

        Schema::table('recursos', function (Blueprint $table) {
            $table->dropColumn('storage_capacity');
        });

        Schema::table('edificios', function (Blueprint $table) {
            $table->dropForeign(['building_type_id']);
            $table->dropColumn('building_type_id');
        });

        Schema::create('building_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->integer('base_production')->default(0);
            $table->string('production_type', 50)->nullable();
            $table->integer('base_build_time')->default(60);
            $table->timestamps();
        });
    }
};
