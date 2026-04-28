<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FarmingTemplate extends Model
{
    protected $table = 'farming_templates';
    
    protected $fillable = [
        'jogador_id',
        'nome',
        'unidades'
    ];

    protected $casts = [
        'unidades' => 'array'
    ];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class);
    }
}
