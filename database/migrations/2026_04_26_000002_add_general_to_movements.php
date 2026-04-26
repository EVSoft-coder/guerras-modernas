<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('movements', function (Blueprint $row) {
            $row->foreignId('general_id')->nullable()->constrained('generais')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('movements', function (Blueprint $row) {
            $row->dropColumn('general_id');
        });
    }
};
