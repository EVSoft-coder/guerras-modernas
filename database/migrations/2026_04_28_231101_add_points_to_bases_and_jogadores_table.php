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
        if (!Schema::hasColumn('bases', 'pontos')) {
            Schema::table('bases', function (Blueprint $table) {
                $table->integer('pontos')->default(0)->after('loyalty');
            });
        }

        if (!Schema::hasColumn('jogadores', 'pontos')) {
            Schema::table('jogadores', function (Blueprint $table) {
                $table->integer('pontos')->default(0)->after('pontos_premium');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bases', function (Blueprint $table) {
            $table->dropColumn('pontos');
        });

        Schema::table('jogadores', function (Blueprint $table) {
            $table->dropColumn('pontos');
        });
    }
};
