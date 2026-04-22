<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitType extends Model
{
    protected $fillable = [
        'name', 'attack', 'defense', 'speed', 'carry_capacity', 
        'cost_suprimentos', 'cost_municoes', 'cost_combustivel', 'build_time'
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = strtolower(str_replace(' ', '_', $value));
    }

    public function getNameAttribute($value)
    {
        return strtolower(str_replace(' ', '_', $value));
    }
}
