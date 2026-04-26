<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConstructionTemplate extends Model
{
    protected $fillable = ['jogador_id', 'name'];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class);
    }

    public function steps()
    {
        return $this->hasMany(ConstructionTemplateStep::class, 'construction_template_id')->orderBy('order');
    }
}
