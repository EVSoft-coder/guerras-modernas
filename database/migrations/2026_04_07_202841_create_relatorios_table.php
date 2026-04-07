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
        Schema::create('relatorios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vencedor_id')->constrained('jogadores');
            $table->string('titulo');
            $table->string('origem_nome');
            $table->string('destino_nome');
            $table->json('detalhes'); // Onde guardamos perdas e saque
            $table->foreignId('atacante_id')->constrained('jogadores');
            $table->foreignId('defensor_id')->constrained('jogadores');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relatorios');
    }
};
