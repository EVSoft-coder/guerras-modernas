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
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function bases()
    {
        return $this->hasMany(Base::class);
    }
}