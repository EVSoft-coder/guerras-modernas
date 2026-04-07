<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Relatorio extends Model
{
    protected $fillable = [
        'vencedor_id',
        'titulo',
        'origem_nome',
        'destino_nome',
        'detalhes',
        'atacante_id',
        'defensor_id',
    ];

    protected $casts = [
        'detalhes' => 'array',
    ];
}
