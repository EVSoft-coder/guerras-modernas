<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Construcao extends Model
{
    protected $table = 'construcoes';

    protected $fillable = [
        'base_id',
        'tipo',
        'nivel_alvo',
        'concluido_em',
    ];

    protected $casts = [
        'concluido_em' => 'datetime',
    ];
}
