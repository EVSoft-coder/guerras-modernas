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
        Schema::table('building_queue', function (Blueprint $table) {
            $table->unique('base_id', 'unique_base_queue');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('building_queue', function (Blueprint $table) {
            $table->dropUnique('unique_base_queue');
        });
    }
};
