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
        if (!Schema::hasTable('unit_types')) {
            Schema::create('unit_types', function (Blueprint $table) {
                $table->id();
                $table->string('name', 50);
                $table->integer('attack');
                $table->integer('defense');
                $table->float('speed');
                $table->integer('carry_capacity');
                $table->integer('cost_suprimentos');
                $table->integer('cost_municoes');
                $table->integer('cost_combustivel');
                $table->integer('build_time');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('units')) {
            Schema::create('units', function (Blueprint $table) {
                $table->id();
                $table->foreignId('base_id')->constrained('bases')->onDelete('cascade');
                $table->foreignId('unit_type_id')->constrained('unit_types')->onDelete('cascade');
                $table->integer('quantity')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('unit_queue')) {
            Schema::create('unit_queue', function (Blueprint $table) {
                $table->id();
                $table->foreignId('base_id')->constrained('bases')->onDelete('cascade');
                $table->foreignId('unit_type_id')->constrained('unit_types')->onDelete('cascade');
                $table->integer('quantity');
                $table->string('status')->default('PENDING');
                $table->timestamp('started_at')->nullable();
                $table->timestamp('finishes_at')->nullable();
                $table->timestamps();

                $table->index('base_id');
                $table->index('finishes_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_queue');
        Schema::dropIfExists('units');
        Schema::dropIfExists('unit_types');
    }
};
