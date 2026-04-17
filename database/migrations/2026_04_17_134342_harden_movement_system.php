<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function run(): void
    {
        Schema::table('movements', function (Blueprint $table) {
            $table->timestamp('processed_at')->nullable()->after('status');
            $table->timestamp('return_time')->nullable()->after('arrival_time');
            $table->string('type', 20)->default('attack')->change(); // attack, support, return (Fase 8.5)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movements', function (Blueprint $table) {
            $table->dropColumn(['processed_at', 'return_time']);
        });
    }
};
