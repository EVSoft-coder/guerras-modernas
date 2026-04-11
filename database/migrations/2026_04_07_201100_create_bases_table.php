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
        if (!Schema::hasTable('bases')) {
            Schema::create('bases', function (Blueprint $table) {
                $table->id();
                $table->foreignIdFor(\App\Models\Jogador::class)->constrained('jogadores')->onDelete('cascade');
                $table->string('nome');
                $table->integer('coordenada_x');
                $table->integer('coordenada_y');
                $table->integer('qg_nivel')->default(1);
                $table->integer('muralha_nivel')->default(0);
                $table->timestamp('ultimo_update')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bases');
    }
};
