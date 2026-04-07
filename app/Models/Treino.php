<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Treino extends Model
{
    protected $table = 'treinos';

    protected $fillable = [
        'base_id',
        'unidade',
        'quantidade',
        'completado_em',
    ];

    protected $casts = [
        'completado_em' => 'datetime',
    ];
}
