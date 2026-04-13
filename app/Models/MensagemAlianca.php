<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MensagemAlianca extends Model
{
    protected $appends = ['ownerId'];
    protected $fillable = ['alianca_id', 'jogador_id', 'mensagem'];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class, 'jogador_id');
    }

    public function alianca()
    {
        return $this->belongsTo(Alianca::class, 'alianca_id');
    }

    public function getOwnerIdAttribute()
    {
        return $this->attributes['jogador_id'] ?? null;
    }
}
