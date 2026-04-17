<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovementUnit extends Model
{
    protected $fillable = ['movement_id', 'unit_type_id', 'quantity'];

    public function type() { return $this->belongsTo(UnitType::class, 'unit_type_id'); }
}
