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
        Schema::create('alliance_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alianca_id')->constrained('aliancas')->onDelete('cascade');
            $table->integer('total_pontos')->default(0);
            $table->integer('total_membros')->default(0);
            $table->integer('total_bases')->default(0);
            $table->date('recorded_at');
            $table->timestamps();

            $table->index(['alianca_id', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alliance_stats');
    }
};
