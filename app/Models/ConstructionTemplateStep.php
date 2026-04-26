<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConstructionTemplateStep extends Model
{
    protected $fillable = ['construction_template_id', 'building_type', 'target_level', 'order'];

    public function template()
    {
        return $this->belongsTo(ConstructionTemplate::class, 'construction_template_id');
    }
}
