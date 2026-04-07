<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alianca extends Model
{
    protected $table = 'aliancas';

    protected $fillable = [
        'nome',
        'tag',
        'fundador_id',
    ];

    public function membros()
    {
        return $this->hasMany(Jogador::class);
    }

    public function fundador()
    {
        return $this->belongsTo(Jogador::class, 'fundador_id');
    }
}
