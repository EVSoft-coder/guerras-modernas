<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Edificio extends Model
{
    protected $table = 'edificios';

    protected $fillable = [
        'base_id',
        'building_type_id',
        'tipo',
        'nivel',
        'pos_x',
        'pos_y',
    ];

    public function type()
    {
        return $this->belongsTo(BuildingType::class, 'building_type_id');
    }

    protected $appends = ['buildingType'];

    public function getBuildingTypeAttribute()
    {
        return $this->tipo;
    }

    public function base()
    {
        return $this->belongsTo(Base::class);
    }
}
