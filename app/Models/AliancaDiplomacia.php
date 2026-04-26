<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AliancaDiplomacia extends Model
{
    protected $table = 'alianca_diplomacia';
    
    protected $fillable = [
        'alianca_id',
        'alvo_alianca_id',
        'tipo'
    ];

    public function alianca(): BelongsTo
    {
        return $this->belongsTo(Alianca::class, 'alianca_id');
    }

    public function alvoAlianca(): BelongsTo
    {
        return $this->belongsTo(Alianca::class, 'alvo_alianca_id');
    }
}
