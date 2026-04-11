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
        Schema::table('jogadores', function (Blueprint $table) {
            if (!Schema::hasColumn('jogadores', 'xp')) {
                $table->unsignedBigInteger('xp')->default(0)->after('email');
            }
            if (!Schema::hasColumn('jogadores', 'nivel')) {
                $table->unsignedInteger('nivel')->default(1)->after('xp');
            }
            if (!Schema::hasColumn('jogadores', 'cargo')) {
                $table->string('cargo')->default('Recruta')->after('nivel');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jogadores', function (Blueprint $table) {
            $table->dropColumn(['xp', 'nivel', 'cargo']);
        });
    }
};
