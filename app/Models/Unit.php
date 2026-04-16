<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = ['base_id', 'unit_type_id', 'quantity'];

    public function type()
    {
        return $this->belongsTo(UnitType::class, 'unit_type_id');
    }
}
