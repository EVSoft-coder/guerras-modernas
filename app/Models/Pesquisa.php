<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pesquisa extends Model
{
    use HasFactory;

    protected $fillable = [
        'ownerId',
        'tipo',
        'nivel',
        'completado_em'
    ];

    protected $casts = [
        'completado_em' => 'datetime'
    ];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class);
    }
}
