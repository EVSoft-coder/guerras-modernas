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
        if (!Schema::hasTable('construcaos')) {
            Schema::create('construcaos', function (Blueprint $table) {
                $table->id();
                $table->foreignId('base_id')->constrained('bases')->onDelete('cascade');
                $table->string('tipo');
                $table->timestamp('concluido_em');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('construcaos');
    }
};
