<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('eventos_mundo')) {
            Schema::create('eventos_mundo', function (Blueprint $table) {
                $table->id();
                $table->string('titulo');
                $table->text('descricao');
                $table->string('tipo');
                $table->json('dados')->nullable();
                $table->timestamp('expira_em')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('eventos_mundo');
    }
};
