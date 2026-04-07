<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ataque extends Model
{
    protected $table = 'ataques';

    protected $fillable = [
        'origem_base_id',
        'destino_base_id',
        'tropas',
        'tipo',
        'chegada_em',
        'processado',
    ];

    protected $casts = [
        'tropas' => 'array',
        'chegada_em' => 'datetime',
    ];

    public function origem()
    {
        return $this->belongsTo(Base::class, 'origem_base_id');
    }

    public function destino()
    {
        return $this->belongsTo(Base::class, 'destino_base_id');
    }
}