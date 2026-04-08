<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Base extends Model
{
    use HasFactory;

    protected $table = 'bases';

    protected $fillable = [
        'jogador_id',
        'nome',
        'coordenada_x',
        'coordenada_y',
        'qg_nivel',
        'muralha_nivel',
        'ultimo_update',
    ];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class);
    }

    public function recursos()
    {
        return $this->hasOne(Recurso::class);
    }

    public function tropas()
    {
        return $this->hasMany(Tropas::class);
    }

    public function edificios()
    {
        return $this->hasMany(Edificio::class);
    }

    public function construcoes()
    {
        return $this->hasMany(Construcao::class, 'base_id');
    }

    public function treinos()
    {
        return $this->hasMany(Treino::class, 'base_id');
    }
}