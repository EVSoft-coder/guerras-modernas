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
        Schema::create('eventos_mundo', function (Blueprint $table) {
            $table->id();
            $table->string('tipo'); // ATAQUE, CONQUISTA, DIPLOMACIA, GLOBAL
            $table->text('mensagem');
            $table->foreignId('jogador_id')->nullable()->constrained('jogadores');
            $table->foreignId('alianca_id')->nullable()->constrained('aliancas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos_mundo');
    }
};
