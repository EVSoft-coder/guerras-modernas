<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Construcao extends Model
{
    protected $table = 'construcoes';

    protected $fillable = [
        'base_id',
        'edificio_tipo',
        'nivel_destino',
        'completado_em',
    ];

    protected $appends = ['buildingType'];

    public function getBuildingTypeAttribute()
    {
        return $this->edificio_tipo;
    }

    protected $casts = [
        'completado_em' => 'datetime',
    ];
}
