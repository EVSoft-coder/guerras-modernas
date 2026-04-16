<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuildingQueue extends Model
{
    protected $table = 'building_queue';

    protected $fillable = [
        'base_id',
        'type',
        'target_level',
        'started_at',
        'finishes_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'finishes_at' => 'datetime',
    ];

    public function base()
    {
        return $this->belongsTo(Base::class);
    }
}
