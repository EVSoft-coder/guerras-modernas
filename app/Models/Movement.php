<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movement extends Model
{
    protected $fillable = [
        'origin_id', 'target_id', 'departure_time', 'arrival_time', 'type', 'status',
        'loot_suprimentos', 'loot_combustivel', 'loot_municoes', 'loot_metal', 'loot_energia',
        'general_id', 'processed_at'
    ];

    protected $casts = [
        'departure_time' => 'datetime',
        'arrival_time' => 'datetime',
        'processed_at' => 'datetime'
    ];

    public function origin() { return $this->belongsTo(Base::class, 'origin_id'); }
    public function target() { return $this->belongsTo(Base::class, 'target_id'); }
    public function units() { return $this->hasMany(MovementUnit::class); }
}
