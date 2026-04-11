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
        if (!Schema::hasTable('aliancas')) {
            Schema::create('aliancas', function (Blueprint $table) {
                $table->id();
                $table->string('nome')->unique();
                $table->string('tag', 5)->unique();
                $table->foreignId('lider_id')->constrained('jogadores');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aliancas');
    }
};
鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓 [failed_replace_file_content_reminder]
As a reminder, the last replace_file_content tool call for TargetFile c:\Users\fotoa\Desktop\MW\guerras-modernas\database\migrations\2026_04_07_213932_create_aliancas_table.php failed because TargetContent was not found in the file.
</failed_replace_file_content_reminder>
