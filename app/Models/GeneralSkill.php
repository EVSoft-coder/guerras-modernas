<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeneralSkill extends Model
{
    protected $fillable = ['general_id', 'skill_slug', 'nivel'];

    public function general()
    {
        return $this->belongsTo(General::class);
    }
}
