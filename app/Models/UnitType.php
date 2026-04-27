<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitType extends Model
{
    protected $fillable = [
        'name', 'slug', 'display_name', 'attack', 'defense', 'speed', 'carry_capacity', 
        'cost_suprimentos', 'cost_municoes', 'cost_combustivel', 'cost_metal', 'cost_pessoal', 'build_time', 'building_type'
    ];
}
