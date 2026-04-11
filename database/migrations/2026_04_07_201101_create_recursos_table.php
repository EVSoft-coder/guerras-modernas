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
        if (!Schema::hasTable('recursos')) {
            Schema::create('recursos', function (Blueprint $table) {
                $table->id();
                $table->foreignId('base_id')->constrained('bases')->onDelete('cascade');
                $table->integer('suprimentos');
                $table->integer('combustivel');
                $table->integer('municoes');
                $table->integer('pessoal');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recursos');
    }
};
