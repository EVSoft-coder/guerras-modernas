<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pesquisa extends Model
{
    use HasFactory;
    protected $appends = ['ownerId'];

    protected $fillable = [
        'jogador_id',
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

    public function getOwnerIdAttribute()
    {
        return $this->attributes['jogador_id'] ?? null;
    }
}
