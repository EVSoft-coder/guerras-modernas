<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reinforcement extends Model
{
    protected $fillable = [
        'origin_base_id',
        'target_base_id',
        'unit_type_id',
        'quantity'
    ];

    public function originBase()
    {
        return $this->belongsTo(Base::class, 'origin_base_id');
    }

    public function targetBase()
    {
        return $this->belongsTo(Base::class, 'target_base_id');
    }

    public function type()
    {
        return $this->belongsTo(UnitType::class, 'unit_type_id');
    }
}
