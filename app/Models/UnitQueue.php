<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitQueue extends Model
{
    protected $table = 'unit_queue';
    protected $fillable = [
        'base_id', 
        'unit_type_id', 
        'quantity', 
        'quantity_remaining',
        'position',
        'duration_per_unit',
        'total_duration',
        'units_produced',
        'started_at', 
        'finishes_at', 
        'cancelled_at',
        'status',
        'cost_suprimentos',
        'cost_combustivel',
        'cost_municoes',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'finishes_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'quantity' => 'integer',
        'quantity_remaining' => 'integer',
        'units_produced' => 'integer',
        'position' => 'integer',
    ];

    public function base()
    {
        return $this->belongsTo(Base::class);
    }

    public function unitType()
    {
        return $this->belongsTo(UnitType::class, 'unit_type_id');
    }
}
