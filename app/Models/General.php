<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class General extends Model
{
    protected $table = 'generais';
    protected $fillable = ['jogador_id', 'nome', 'nivel', 'experiencia', 'pontos_skill', 'estatisticas', 'arsenal', 'base_id'];
    protected $casts = [
        'estatisticas' => 'array',
        'arsenal' => 'array'
    ];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class);
    }

    public function skills()
    {
        return $this->hasMany(GeneralSkill::class);
    }

    public function base()
    {
        return $this->belongsTo(Base::class);
    }
}
