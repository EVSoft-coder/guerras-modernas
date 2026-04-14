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
            $table->decimal('recursos_metal', 20, 2)->default(1000);
            $table->decimal('recursos_energia', 20, 2)->default(1000);
            $table->decimal('recursos_comida', 20, 2)->default(1000);
            $table->timestamp('last_update_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bases', function (Blueprint $table) {
            $table->dropColumn(['recursos_metal', 'recursos_energia', 'recursos_comida', 'last_update_at']);
        });
    }
};
