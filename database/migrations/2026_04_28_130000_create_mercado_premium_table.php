<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mercado_premium', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vendedor_id');
            $table->string('recurso_tipo');
            $table->integer('quantidade');
            $table->integer('preco_pp');
            $table->enum('status', ['open', 'completed', 'cancelled'])->default('open');
            $table->timestamps();

            $table->foreign('vendedor_id')->references('id')->on('jogadores')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mercado_premium');
    }
};
