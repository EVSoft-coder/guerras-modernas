<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function run(): void
    {
        Schema::create('movements', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('origin_id')->constrained('bases')->onDelete('cascade');
            $blueprint->foreignId('target_id')->constrained('bases')->onDelete('cascade');
            $blueprint->json('units');
            $blueprint->timestamp('departure_time');
            $blueprint->timestamp('arrival_time');
            $blueprint->string('type', 20)->default('attack'); // attack, support
            $blueprint->timestamps();
        });

        Schema::table('bases', function (Blueprint $table) {
            // Index para coordenadas únicas (Passo 1 e 2)
            $table->index(['x', 'y'], 'idx_coordinates');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movements');
        Schema::table('bases', function (Blueprint $table) {
            $table->dropIndex('idx_coordinates');
        });
    }
};
