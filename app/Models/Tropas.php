<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tropas extends Model
{
    protected $table = 'tropas';

    protected $fillable = [
        'base_id',
        'unidade',
        'quantidade',
    ];

    public function base()
    {
        return $this->belongsTo(Base::class);
    }
}