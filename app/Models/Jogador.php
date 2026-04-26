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
        'xp',
        'nivel',
        'cargo',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function pesquisas()
    {
        return $this->hasMany(Pesquisa::class);
    }

    /**
     * Obtém o nível atual de uma tecnologia terminada.
     */
    public function obterNivelTech($tipo)
    {
        return $this->pesquisas()
            ->where('tipo', $tipo)
            ->where('completado_em', '<=', now())
            ->orderBy('nivel', 'desc')
            ->first()?->nivel ?? 0;
    }

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

    public function general()
    {
        return $this->hasOne(General::class, 'jogador_id');
    }

    /**
     * Verifica se o jogador ainda está sob proteção de novato.
     */
    public function sobProtecao()
    {
        $horasProtecao = config('game.speed.protection_hours', 24);
        return $this->created_at->addHours($horasProtecao)->isFuture();
    }
}
