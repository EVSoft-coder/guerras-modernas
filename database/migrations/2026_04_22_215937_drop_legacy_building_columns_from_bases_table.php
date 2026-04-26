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
            if (Schema::hasColumn('bases', 'qg_nivel')) {
                $table->dropColumn('qg_nivel');
            }
            if (Schema::hasColumn('bases', 'muralha_nivel')) {
                $table->dropColumn('muralha_nivel');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bases', function (Blueprint $table) {
            $table->integer('qg_nivel')->default(1);
            $table->integer('muralha_nivel')->default(0);
        });
    }
};
