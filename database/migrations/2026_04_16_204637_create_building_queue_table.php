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
        Schema::create('building_queue', function (Illuminate\Database\Schema\Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('base_id');
            $table->string('type'); // building_type_id as string (e.g. 'f_brica')
            $table->integer('target_level');
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('finishes_at');
            $table->timestamps();

            $table->foreign('base_id')->references('id')->on('bases')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('building_queue');
    }
};
