<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('base.{id}', function ($user, $id) {
    return \App\Models\Base::where('id', $id)->where('jogador_id', $user->id)->exists();
});
