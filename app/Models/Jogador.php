<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Jogador extends Authenticatable
{
    use Notifiable;

    protected $table = 'jogadores';

    protected $fillable = [
        'username',
        'email',
        'password',
        'nome',
        'alianca_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function bases()
    {
        return $this->hasMany(Base::class);
    }

    public function alianca()
    {
        return $this->belongsTo(Alianca::class);
    }

    public function pedidosAlianca()
    {
        return $this->hasMany(PedidoAlianca::class, 'jogador_id');
    }
}