<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaseGroup extends Model
{
    protected $fillable = ['jogador_id', 'name', 'color'];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class);
    }

    public function bases()
    {
        return $this->belongsToMany(Base::class, 'base_group_assignments');
    }
}
