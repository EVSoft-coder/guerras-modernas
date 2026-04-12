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
        Schema::table('bases', function (Blueprint $table) {
            $table->boolean('is_protected')->default(false);
            $table->timestamp('protection_until')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bases', function (Blueprint $table) {
            $table->dropColumn(['is_protected', 'protection_until']);
        });
    }
};
