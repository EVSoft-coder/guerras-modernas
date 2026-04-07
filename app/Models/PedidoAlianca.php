<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidoAlianca extends Model
{
    protected $table = 'pedidos_alianca';

    protected $fillable = [
        'jogador_id',
        'alianca_id',
        'status',
    ];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class, 'jogador_id');
    }

    public function alianca()
    {
        return $this->belongsTo(Alianca::class, 'alianca_id');
    }
}
