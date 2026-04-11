<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('treinos')) {
            Schema::create('treinos', function (Blueprint $table) {
                $table->id();
                $table->foreignId('base_id')->constrained('bases')->onDelete('cascade');
                $table->string('unidade');
                $table->integer('quantidade');
                $table->timestamp('concluido_em');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('treinos');
    }
};
