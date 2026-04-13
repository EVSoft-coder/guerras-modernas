<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recurso extends Model
{
    protected $table = 'recursos';

    protected $fillable = [
        'base_id',
        'suprimentos',
        'combustivel',
        'municoes',
        'pessoal',
    ];

    public function base()
    {
        return $this->belongsTo(Base::class);
    }
}
