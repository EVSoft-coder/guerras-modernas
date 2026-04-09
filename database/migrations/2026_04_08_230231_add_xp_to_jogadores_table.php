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
            $table->unsignedBigInteger('xp')->default(0)->after('alianca_id');
            $table->unsignedInteger('nivel')->default(1)->after('xp');
            $table->string('cargo')->default('Recruta')->after('nivel');
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
