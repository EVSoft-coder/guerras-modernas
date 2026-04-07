<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Edificio extends Model
{
    protected $table = 'edificios';

    protected $fillable = [
        'base_id',
        'tipo',
        'nivel',
    ];

    public function base()
    {
        return $this->belongsTo(Base::class);
    }
}