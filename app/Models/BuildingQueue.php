<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuildingQueue extends Model
{
    protected $table = 'building_queue';

    protected $fillable = [
        'base_id',
        'building_id',
        'position',
        'type',
        'target_level',
        'duration',
        'status',
        'started_at',
        'finishes_at',
        'cancelled_at',
        'cost_suprimentos',
        'cost_combustivel',
        'cost_municoes',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'finishes_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'position' => 'integer',
        'duration' => 'integer',
    ];

    public function setTypeAttribute($value)
    {
        $normalized = strtolower(str_replace(' ', '_', $value));
        if ($normalized === 'qg') $normalized = 'hq';
        $this->attributes['type'] = $normalized;
    }

    public function getTypeAttribute($value)
    {
        $normalized = strtolower(str_replace(' ', '_', $value));
        if ($normalized === 'qg') return 'hq';
        return $normalized;
    }

    public function base()
    {
        return $this->belongsTo(Base::class);
    }
}
