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

    public function pedidos()
    {
        return $this->hasMany(PedidoAlianca::class, 'alianca_id');
    }

    public function mensagens()
    {
        return $this->hasMany(MensagemAlianca::class, 'alianca_id');
    }
}
