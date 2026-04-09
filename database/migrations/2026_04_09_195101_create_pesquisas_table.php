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
        Schema::create('pesquisas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jogador_id')->constrained('jogadores')->onDelete('cascade');
            $table->string('tipo'); // ex: pontaria, blindagem, logistica
            $table->unsignedInteger('nivel');
            $table->timestamp('completado_em');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesquisas');
    }
};
