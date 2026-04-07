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
        'concluido_em',
    ];

    protected $casts = [
        'concluido_em' => 'datetime',
    ];
}
