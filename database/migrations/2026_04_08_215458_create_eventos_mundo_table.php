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
        if (!Schema::hasTable('eventos_mundo')) {
            Schema::create('eventos_mundo', function (Blueprint $table) {
                $table->id();
                $table->string('titulo');
                $table->text('descricao');
                $table->string('tipo');
                $table->json('dados')->nullable();
                $table->timestamp('expira_em')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos_mundo');
    }
};
鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓 [failed_replace_file_content_reminder]
As a reminder, the last replace_file_content tool call for TargetFile c:\Users\fotoa\Desktop\MW\guerras-modernas\database\migrations\2026_04_08_215458_create_eventos_mundo_table.php failed because TargetContent was not found in the file.
</failed_replace_file_content_reminder>
