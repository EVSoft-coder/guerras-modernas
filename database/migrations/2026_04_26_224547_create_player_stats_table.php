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
        Schema::create('player_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jogador_id')->constrained('jogadores')->onDelete('cascade');
            $table->integer('pontos')->default(0);
            $table->integer('total_units')->default(0);
            $table->integer('attack_power')->default(0);
            $table->integer('defense_power')->default(0);
            $table->integer('total_bases')->default(0);
            $table->date('recorded_at');
            $table->timestamps();

            $table->index(['jogador_id', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_stats');
    }
};
