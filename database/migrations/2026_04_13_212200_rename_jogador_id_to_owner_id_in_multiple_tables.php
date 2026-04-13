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
            $table->renameColumn('ownerId', 'ownerId');
        });
        Schema::table('pesquisas', function (Blueprint $table) {
            $table->renameColumn('ownerId', 'ownerId');
        });
        Schema::table('mensagem_aliancas', function (Blueprint $table) {
            $table->renameColumn('ownerId', 'ownerId');
        });
        Schema::table('pedido_aliancas', function (Blueprint $table) {
            $table->renameColumn('ownerId', 'ownerId');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bases', function (Blueprint $table) {
            $table->renameColumn('ownerId', 'ownerId');
        });
        Schema::table('pesquisas', function (Blueprint $table) {
            $table->renameColumn('ownerId', 'ownerId');
        });
        Schema::table('mensagem_aliancas', function (Blueprint $table) {
            $table->renameColumn('ownerId', 'ownerId');
        });
        Schema::table('pedido_aliancas', function (Blueprint $table) {
            $table->renameColumn('ownerId', 'ownerId');
        });
    }
};
