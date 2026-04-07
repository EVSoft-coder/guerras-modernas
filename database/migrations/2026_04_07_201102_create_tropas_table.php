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
        Schema::create('tropas', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Base::class)->constrained('bases')->onDelete('cascade');
            $table->string('unidade');
            $table->integer('quantidade')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tropas');
    }
};
