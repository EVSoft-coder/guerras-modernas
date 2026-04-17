<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildingType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'base_production',
        'production_type',
        'base_build_time'
    ];

    public function edificios()
    {
        return $this->hasMany(Edificio::class);
    }
}
