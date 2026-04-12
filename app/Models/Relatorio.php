<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Relatorio extends Model
{
    protected $table = 'relatorios';

    protected $fillable = [
        'atacante_id',
        'defensor_id',
        'vitoria',
        'dados',
    ];

    protected $casts = [
        'dados' => 'array',
        'vitoria' => 'boolean',
    ];

    public function atacante()
    {
        return $this->belongsTo(Jogador::class, 'atacante_id');
    }

    public function defensor()
    {
        return $this->belongsTo(Jogador::class, 'defensor_id');
    }
}
