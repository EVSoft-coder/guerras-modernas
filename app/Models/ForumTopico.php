<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumTopico extends Model
{
    protected $table = 'alianca_forum_topicos';
    
    protected $fillable = [
        'alianca_id',
        'jogador_id',
        'titulo',
        'last_post_at'
    ];

    public function alianca(): BelongsTo
    {
        return $this->belongsTo(Alianca::class, 'alianca_id');
    }

    public function jogador(): BelongsTo
    {
        return $this->belongsTo(Jogador::class, 'jogador_id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(ForumPost::class, 'topico_id');
    }
}
