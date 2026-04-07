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
        Schema::create('recursos', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Base::class)->constrained('bases')->onDelete('cascade');
            $table->double('suprimentos')->default(500);
            $table->double('combustivel')->default(500);
            $table->double('municoes')->default(500);
            $table->double('pessoal')->default(100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recursos');
    }
};
