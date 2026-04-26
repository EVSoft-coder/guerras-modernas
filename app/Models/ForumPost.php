<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForumPost extends Model
{
    protected $table = 'alianca_forum_posts';
    
    protected $fillable = [
        'topico_id',
        'jogador_id',
        'conteudo'
    ];

    public function topico(): BelongsTo
    {
        return $this->belongsTo(ForumTopico::class, 'topico_id');
    }

    public function jogador(): BelongsTo
    {
        return $this->belongsTo(Jogador::class, 'jogador_id');
    }
}
