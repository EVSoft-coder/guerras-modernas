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
        if (!Schema::hasTable('jogadores')) {
            Schema::create('jogadores', function (Blueprint $table) {
                $table->id();
                $table->string('username')->unique();
                $table->string('email')->unique();
                $table->string('password');
                $table->string('nome')->nullable();
                $table->rememberToken();
                $table->timestamps();
            });
        }
    }鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓 [failed_replace_file_content_reminder]
As a reminder, the last replace_file_content tool call for TargetFile c:\Users\fotoa\Desktop\MW\guerras-modernas\database\migrations\2026_04_07_201100_create_jogadores_table.php failed because TargetContent was not found in the file.
</failed_replace_file_content_reminder>


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jogadores');
    }
};
