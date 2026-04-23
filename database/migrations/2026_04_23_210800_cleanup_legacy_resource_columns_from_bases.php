<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * FASE CORE: Remoção de taxas e recursos redundantes da tabela bases.
     */
    public function up(): void
    {
        Schema::table('bases', function (Blueprint $table) {
            // Remover colunas de recursos legadas (agora na tabela recursos)
            $columnsToDrop = [];
            
            foreach (['recursos_metal', 'recursos_energia', 'recursos_comida', 'last_update_at'] as $col) {
                if (Schema::hasColumn('bases', $col)) {
                    $columnsToDrop[] = $col;
                }
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bases', function (Blueprint $table) {
            $table->decimal('recursos_metal', 20, 2)->default(1000);
            $table->decimal('recursos_energia', 20, 2)->default(1000);
            $table->decimal('recursos_comida', 20, 2)->default(1000);
            $table->timestamp('last_update_at')->nullable();
        });
    }
};
