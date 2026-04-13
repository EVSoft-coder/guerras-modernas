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
        Schema::create('pedido_aliancas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jogador_id')->constrained('jogadores')->onDelete('cascade');
            $table->foreignId('alianca_id')->constrained('aliancas')->onDelete('cascade');
            $table->string('status')->default('pendente'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_aliancas');
    }
};
