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
            $table->decimal('loot_suprimentos', 20, 2)->default(0);
            $table->decimal('loot_combustivel', 20, 2)->default(0);
            $table->decimal('loot_municoes', 20, 2)->default(0);
            $table->decimal('loot_metal', 20, 2)->default(0);
            $table->decimal('loot_energia', 20, 2)->default(0);
            $table->decimal('loot_pessoal', 20, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movements', function (Blueprint $table) {
            $table->dropColumn([
                'loot_suprimentos', 'loot_combustivel', 'loot_municoes', 
                'loot_metal', 'loot_energia', 'loot_pessoal'
            ]);
        });
    }
};
