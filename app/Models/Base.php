<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasResources;

use App\Services\GameService;
use App\Domain\Economy\EconomyRules;
use App\Domain\Building\BuildingType;

class Base extends Model
{
    use HasFactory, HasResources;

    protected $table = 'bases';
    protected $appends = ['ownerId'];

    protected $fillable = [
        'jogador_id',
        'nome',
        'coordenada_x',
        'coordenada_y',
        'x',
        'y',
        'ultimo_update',
        'is_protected',
        'protection_until',
        'loyalty'
    ];

    protected $casts = [
        'is_protected' => 'boolean',
        'protection_until' => 'datetime',
        'ultimo_update' => 'datetime',
        'loyalty' => 'integer',
    ];


    public function getResourcesAttribute()
    {
        return $this->recursos;
    }

    private function obterNivelEdificio($tipo)
    {
        return (int) ($this->edificios->where('tipo', $tipo)->first()?->nivel ?? 0);
    }

    public function jogador()
    {
        return $this->belongsTo(Jogador::class);
    }


    public function tropas()
    {
        return $this->hasMany(Unit::class, 'base_id');
    }

    public function edificios()
    {
        return $this->hasMany(Edificio::class);
    }

    public function groups()
    {
        return $this->belongsToMany(BaseGroup::class, 'base_group_assignments');
    }

    public function buildingQueue()
    {
        return $this->hasMany(BuildingQueue::class)->orderBy('position');
    }

    public function movements()
    {
        return $this->hasMany(Movement::class, 'origin_id');
    }

    public function incomingMovements()
    {
        return $this->hasMany(Movement::class, 'target_id');
    }

    public function units()
    {
        return $this->hasMany(Unit::class, 'base_id');
    }

    public function unitQueue()
    {
        return $this->hasMany(UnitQueue::class, 'base_id')->orderBy('position');
    }

    /* Mapeamento Táctico para ECS Interface */
    public function getOwnerIdAttribute()
    {
        return $this->attributes['jogador_id'] ?? null;
    }
}
