<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Relatorio extends Model
{
    protected $table = 'relatorios';
    public $timestamps = false; // Dump shows only created_at with default current_timestamp

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

    public function atacante()
    {
        return $this->belongsTo(Jogador::class, 'atacante_id');
    }

    public function defensor()
    {
        return $this->belongsTo(Jogador::class, 'defensor_id');
    }

    public function vencedor()
    {
        return $this->belongsTo(Jogador::class, 'vencedor_id');
    }
}
