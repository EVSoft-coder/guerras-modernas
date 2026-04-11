<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ataques', function (Blueprint $table) {
            if (!Schema::hasColumn('ataques', 'saque')) {
                $table->json('saque')->nullable()->after('tropas');
            }
        });
    }

    public function down(): void
    {
        Schema::table('ataques', function (Blueprint $table) {
            $table->dropColumn('saque');
        });
    }
};
