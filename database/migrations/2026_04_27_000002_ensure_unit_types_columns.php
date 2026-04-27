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
        Schema::table('unit_types', function (Blueprint $table) {
            if (!Schema::hasColumn('unit_types', 'slug')) {
                $table->string('slug')->nullable()->after('name')->unique();
            }
            if (!Schema::hasColumn('unit_types', 'building_type')) {
                $table->string('building_type')->nullable()->after('slug');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('unit_types', function (Blueprint $table) {
            $table->dropColumn(['slug', 'building_type']);
        });
    }
};
