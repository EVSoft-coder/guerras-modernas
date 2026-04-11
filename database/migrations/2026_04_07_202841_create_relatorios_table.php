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
        if (!Schema::hasTable('relatorios')) {
            Schema::create('relatorios', function (Blueprint $table) {
                $table->id();
                $table->foreignId('atacante_id')->nullable()->constrained('jogadores')->onDelete('cascade');
                $table->foreignId('defensor_id')->nullable()->constrained('jogadores')->onDelete('cascade');
                $table->boolean('vitoria');
                $table->json('dados');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relatorios');
    }
};
