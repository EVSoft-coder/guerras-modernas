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
            $table->double('suprimentos', 20, 4)->default(0)->change();
            $table->double('combustivel', 20, 4)->default(0)->change();
            $table->double('municoes', 20, 4)->default(0)->change();
            $table->double('metal', 20, 4)->default(0)->change();
            $table->double('energia', 20, 4)->default(0)->change();
            $table->double('pessoal', 20, 4)->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recursos', function (Blueprint $table) {
            $table->bigInteger('suprimentos')->unsigned()->default(0)->change();
            $table->bigInteger('combustivel')->unsigned()->default(0)->change();
            $table->bigInteger('municoes')->unsigned()->default(0)->change();
            $table->bigInteger('metal')->unsigned()->default(0)->change();
            $table->bigInteger('energia')->unsigned()->default(0)->change();
            $table->integer('pessoal')->unsigned()->default(0)->change();
        });
    }
};
