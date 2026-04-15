<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Edificio extends Model
{
    protected $table = 'edificios';

    protected $fillable = [
        'base_id',
        'tipo',
        'nivel',
        'pos_x',
        'pos_y',
    ];

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
