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
        Schema::table('building_queue', function (Blueprint $table) {
            if (!Schema::hasColumn('building_queue', 'position')) {
                $table->integer('position')->default(1)->after('base_id');
            }
            if (!Schema::hasColumn('building_queue', 'duration')) {
                $table->integer('duration')->nullable()->after('target_level');
            }
            if (!Schema::hasColumn('building_queue', 'status')) {
                $table->string('status')->default('PENDING')->after('duration');
            }
            if (!Schema::hasColumn('building_queue', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('finishes_at');
            }
            // Garantir que started_at é nullable
            $table->timestamp('started_at')->nullable()->change();
        });

        Schema::table('unit_queue', function (Blueprint $table) {
            if (!Schema::hasColumn('unit_queue', 'units_produced')) {
                $table->integer('units_produced')->default(0)->after('quantity');
            }
            if (!Schema::hasColumn('unit_queue', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('finishes_at');
            }
            if (!Schema::hasColumn('unit_queue', 'position')) {
                $table->integer('position')->default(1)->after('base_id');
            }
            if (!Schema::hasColumn('unit_queue', 'quantity_remaining')) {
                $table->integer('quantity_remaining')->nullable()->after('quantity');
            }
            if (!Schema::hasColumn('unit_queue', 'duration_per_unit')) {
                $table->integer('duration_per_unit')->nullable()->after('quantity_remaining');
            }
            if (!Schema::hasColumn('unit_queue', 'total_duration')) {
                $table->integer('total_duration')->nullable()->after('duration_per_unit');
            }
            if (!Schema::hasColumn('unit_queue', 'cost_suprimentos')) {
                $table->integer('cost_suprimentos')->default(0);
                $table->integer('cost_combustivel')->default(0);
                $table->integer('cost_municoes')->default(0);
            }
            //started_at
            $table->timestamp('started_at')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('building_queue', function (Blueprint $table) {
            $table->dropColumn(['position', 'duration', 'status', 'cancelled_at']);
        });

        Schema::table('unit_queue', function (Blueprint $table) {
            $table->dropColumn([
                'units_produced', 'cancelled_at', 'position', 
                'quantity_remaining', 'duration_per_unit', 'total_duration',
                'cost_suprimentos', 'cost_combustivel', 'cost_municoes'
            ]);
        });
    }
};
