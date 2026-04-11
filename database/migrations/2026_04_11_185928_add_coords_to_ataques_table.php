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
        Schema::table('ataques', function (Blueprint $table) {
            if (!Schema::hasColumn('ataques', 'destino_x')) {
                $table->integer('destino_x')->nullable()->after('destino_base_id');
            }
            if (!Schema::hasColumn('ataques', 'destino_y')) {
                $table->integer('destino_y')->nullable()->after('destino_x');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ataques', function (Blueprint $table) {
            $table->dropColumn(['destino_x', 'destino_y']);
        });
    }
};
