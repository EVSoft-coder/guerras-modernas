<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('generais', function (Blueprint $row) {
            $row->id();
            $row->foreignId('jogador_id')->constrained('jogadores')->onDelete('cascade');
            $row->string('nome')->default('O General');
            $row->integer('nivel')->default(1);
            $row->integer('experiencia')->default(0);
            $row->integer('pontos_skill')->default(0);
            $row->json('estatisticas')->nullable(); // Atributos base
            $row->json('arsenal')->nullable();     // Equipamento ativo
            $row->foreignId('base_id')->nullable()->constrained('bases')->onDelete('set null'); // Onde o herói está estacionado
            $row->timestamps();
        });

        Schema::create('general_skills', function (Blueprint $row) {
            $row->id();
            $row->foreignId('general_id')->constrained('generais')->onDelete('cascade');
            $row->string('skill_slug');
            $row->integer('nivel')->default(0);
            $row->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('general_skills');
        Schema::dropIfExists('generais');
    }
};
