<?php

namespace App\Policies;

use App\Models\Base;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Access\Response;

class BasePolicy
{
    /**
     * Determina se o utilizador pode visualizar a base.
     */
    public function view(Authenticatable $user, Base $base): bool
    {
        return $base->jogador_id === $user->getAuthIdentifier();
    }

    /**
     * Determina se o utilizador pode realizar operações (upgrade, treinar, etc) na base.
     */
    public function update(Authenticatable $user, Base $base): bool
    {
        return $base->jogador_id === $user->getAuthIdentifier();
    }

    /**
     * Determina se o utilizador pode comandar ataques a partir desta base.
     */
    public function command(Authenticatable $user, Base $base): bool
    {
        return $base->jogador_id === $user->getAuthIdentifier();
    }
}
