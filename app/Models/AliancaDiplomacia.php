<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AliancaDiplomacia extends Model
{
    protected $table = 'alianca_diplomacia';

    protected $fillable = [
        'alianca_id',
        'target_alianca_id',
        'tipo',
        'status',
    ];

    public function alianca()
    {
        return $this->belongsTo(Alianca::class, 'alianca_id');
    }

    public function targetAlianca()
    {
        return $this->belongsTo(Alianca::class, 'target_alianca_id');
    }
}
