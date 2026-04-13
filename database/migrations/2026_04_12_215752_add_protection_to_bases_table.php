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
            if (!Schema::hasColumn('bases', 'is_protected')) {
                $table->boolean('is_protected')->default(false);
            }
            if (!Schema::hasColumn('bases', 'protection_until')) {
                $table->timestamp('protection_until')->nullable();
            }
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
