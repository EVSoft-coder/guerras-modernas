<?php

namespace App\Policies;

use App\Models\Base;
use App\Models\Jogador;
use Illuminate\Auth\Access\Response;

class BasePolicy
{
    /**
     * Determina se o utilizador pode visualizar a base.
     */
    public function view(Jogador $user, Base $base): bool
    {
        return $base->jogador_id === $user->id;
    }

    /**
     * Determina se o utilizador pode realizar operações (upgrade, treinar, etc) na base.
     */
    public function update(Jogador $user, Base $base): bool
    {
        return $base->jogador_id === $user->id;
    }

    /**
     * Determina se o utilizador pode comandar ataques a partir desta base.
     */
    public function command(Jogador $user, Base $base): bool
    {
        return $base->jogador_id === $user->id;
    }
}
