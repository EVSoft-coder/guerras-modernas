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
        Schema::create('construction_template_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('construction_template_id')->constrained('construction_templates')->onDelete('cascade');
            $table->string('building_type');
            $table->integer('target_level');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('construction_template_steps');
    }
};
