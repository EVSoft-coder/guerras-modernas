<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitQueue extends Model
{
    protected $table = 'unit_queue';
    protected $fillable = ['base_id', 'unit_type_id', 'quantity', 'started_at', 'finishes_at', 'status'];
    protected $casts = [
        'started_at' => 'datetime',
        'finishes_at' => 'datetime',
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
