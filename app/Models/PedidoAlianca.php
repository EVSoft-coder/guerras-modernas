<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidoAlianca extends Model
{
    protected $table = 'pedido_aliancas';

    protected $fillable = [
        'ownerId',
        'alianca_id',
        'status',
    ];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class, 'ownerId');
    }

    public function alianca()
    {
        return $this->belongsTo(Alianca::class, 'alianca_id');
    }
}
