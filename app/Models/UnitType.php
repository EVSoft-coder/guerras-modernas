<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitType extends Model
{
    protected $fillable = [
        'name', 'attack', 'defense', 'speed', 'carry_capacity', 
        'cost_suprimentos', 'cost_municoes', 'cost_combustivel', 'build_time'
    ];
}
