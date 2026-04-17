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
        // 1. Criar tabela movements (Normalizada)
        Schema::create('movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('origin_id')->constrained('bases')->onDelete('cascade');
            $table->foreignId('target_id')->constrained('bases')->onDelete('cascade');
            $table->timestamp('departure_time');
            $table->timestamp('arrival_time');
            $table->string('type', 20)->default('attack'); // attack, support
            $table->timestamps();
        });

        // 2. Criar tabela movement_units (Passo 6)
        Schema::create('movement_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('movement_id')->constrained('movements')->onDelete('cascade');
            $table->foreignId('unit_type_id')->constrained('unit_types')->onDelete('cascade');
            $table->integer('quantity')->unsigned();
            $table->timestamps();
        });

        // 3. Adicionar UNIQUE CONSTRAINT em bases (Passo 1)
        Schema::table('bases', function (Blueprint $table) {
            // Removemos o índice antigo se existir e adicionamos a constraint única
            try { $table->dropIndex('idx_coordinates'); } catch(\Exception $e) {}
            $table->unique(['x', 'y'], 'unique_coordinates');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movement_units');
        Schema::dropIfExists('movements');
        Schema::table('bases', function (Blueprint $table) {
            $table->dropUnique('unique_coordinates');
        });
    }
};
