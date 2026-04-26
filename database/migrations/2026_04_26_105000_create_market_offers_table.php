<?php
 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
 
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('market_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('base_id')->constrained('bases')->onDelete('cascade');
            $table->string('offered_resource');
            $table->decimal('offered_amount', 20, 2);
            $table->string('requested_resource');
            $table->decimal('requested_amount', 20, 2);
            $table->string('status')->default('open'); // open, accepted, cancelled
            $table->timestamps();
        });
    }
 
    public function down(): void
    {
        Schema::dropIfExists('market_offers');
    }
};
