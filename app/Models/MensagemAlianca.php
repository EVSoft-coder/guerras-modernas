<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MensagemAlianca extends Model
{
    protected $fillable = ['alianca_id', 'ownerId', 'mensagem'];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class, 'ownerId');
    }

    public function alianca()
    {
        return $this->belongsTo(Alianca::class, 'alianca_id');
    }
}
