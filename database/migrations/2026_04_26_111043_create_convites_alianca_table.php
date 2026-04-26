<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('convites_alianca', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alianca_id')->constrained('aliancas')->onDelete('cascade');
            $table->foreignId('jogador_id')->constrained('jogadores')->onDelete('cascade');
            $table->foreignId('convidado_por_id')->constrained('jogadores')->onDelete('cascade');
            $table->enum('status', ['pendente', 'aceite', 'rejeitado'])->default('pendente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('convites_alianca');
    }
};
