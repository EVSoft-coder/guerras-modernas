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
        Schema::table('relatorios', function (Blueprint $table) {
            $table->boolean('partilhado_alianca')->default(false)->after('detalhes');
            $table->boolean('publico')->default(false)->after('partilhado_alianca');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('relatorios', function (Blueprint $table) {
            $table->dropColumn(['partilhado_alianca', 'publico']);
        });
    }
};
