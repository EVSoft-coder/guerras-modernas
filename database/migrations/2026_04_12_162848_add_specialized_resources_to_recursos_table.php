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
        Schema::table('recursos', function (Blueprint $table) {
            if (!Schema::hasColumn('recursos', 'metal')) {
                $table->integer('metal')->default(1000)->after('pessoal');
            }
            if (!Schema::hasColumn('recursos', 'energia')) {
                $table->integer('energia')->default(500)->after('metal');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recursos', function (Blueprint $table) {
            $table->dropColumn(['metal', 'energia']);
        });
    }
};
