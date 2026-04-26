<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConviteAlianca extends Model
{
    protected $table = 'convites_alianca';
    
    protected $fillable = [
        'alianca_id',
        'jogador_id',
        'convidado_por_id',
        'status'
    ];

    public function alianca(): BelongsTo
    {
        return $this->belongsTo(Alianca::class, 'alianca_id');
    }

    public function jogador(): BelongsTo
    {
        return $this->belongsTo(Jogador::class, 'jogador_id');
    }

    public function convidadoPor(): BelongsTo
    {
        return $this->belongsTo(Jogador::class, 'convidado_por_id');
    }
}
