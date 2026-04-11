<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('ataques')) {
            Schema::create('ataques', function (Blueprint $table) {
                $table->id();
                $table->foreignId('origem_base_id')->constrained('bases')->onDelete('cascade');
                $table->foreignId('destino_base_id')->nullable()->constrained('bases')->onDelete('cascade');
                $table->json('tropas');
                $table->string('tipo');
                $table->timestamp('chegada_em');
                $table->boolean('processado')->default(false);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ataques');
    }
};
