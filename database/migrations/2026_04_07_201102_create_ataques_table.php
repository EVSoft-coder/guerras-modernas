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
        if (!Schema::hasTable('ataques')) {
            Schema::create('ataques', function (Blueprint $table) {
                $table->id();
                $table->foreignId('origem_base_id')->constrained('bases')->onDelete('cascade');
                $table->foreignId('destino_base_id')->nullable()->constrained('bases')->onDelete('cascade');
                $table->json('tropas');
                $table->string('tipo');
                $table->timestamp('chegada_em');
                $table->boolean('processado')->default(false);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ataques');
    }
};
鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓鼓 [failed_replace_file_content_reminder]
As a reminder, the last replace_file_content tool call for TargetFile c:\Users\fotoa\Desktop\MW\guerras-modernas\database\migrations\2026_04_07_201102_create_ataques_table.php failed because TargetContent was not found in the file.
</failed_replace_file_content_reminder>
