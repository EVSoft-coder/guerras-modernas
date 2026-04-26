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
        Schema::create('alianca_diplomacia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alianca_id')->constrained('aliancas')->onDelete('cascade');
            $table->foreignId('alvo_alianca_id')->constrained('aliancas')->onDelete('cascade');
            $table->enum('tipo', ['aliado', 'pna', 'inimigo']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alianca_diplomacia');
    }
};
