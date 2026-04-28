<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MercadoPremium extends Model
{
    protected $table = 'mercado_premium';

    protected $fillable = [
        'vendedor_id',
        'recurso_tipo',
        'quantidade',
        'preco_pp',
        'status'
    ];

    public function vendedor(): BelongsTo
    {
        return $this->belongsTo(Jogador::class, 'vendedor_id');
    }
}
