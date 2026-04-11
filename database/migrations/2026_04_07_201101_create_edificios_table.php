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
        if (!Schema::hasTable('edificios')) {
            Schema::create('edificios', function (Blueprint $table) {
                $table->id();
                $table->foreignId('base_id')->constrained('bases')->onDelete('cascade');
                $table->string('tipo');
                $table->integer('nivel')->default(1);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('edificios');
    }
};
