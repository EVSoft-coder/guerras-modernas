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
        if (!Schema::hasTable('mensagem_aliancas')) {
            Schema::create('mensagem_aliancas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('alianca_id')->constrained('aliancas')->onDelete('cascade');
                $table->foreignId('jogador_id')->constrained('jogadores')->onDelete('cascade');
                $table->text('mensagem');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensagem_aliancas');
    }
};
