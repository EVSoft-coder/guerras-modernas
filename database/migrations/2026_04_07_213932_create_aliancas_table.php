<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('aliancas')) {
            Schema::create('aliancas', function (Blueprint $table) {
                $table->id();
                $table->string('nome')->unique();
                $table->string('tag', 5)->unique();
                $table->foreignId('lider_id')->constrained('jogadores');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('aliancas');
    }
};
