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
        Schema::create('alianca_forum_topicos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alianca_id')->constrained('aliancas')->onDelete('cascade');
            $table->foreignId('jogador_id')->constrained('jogadores');
            $table->string('titulo');
            $table->timestamp('last_post_at')->useCurrent();
            $table->timestamps();
        });

        Schema::create('alianca_forum_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topico_id')->constrained('alianca_forum_topicos')->onDelete('cascade');
            $table->foreignId('jogador_id')->constrained('jogadores');
            $table->text('conteudo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alianca_forum_posts');
        Schema::dropIfExists('alianca_forum_topicos');
    }
};
