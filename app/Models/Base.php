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
    protected $appends = ['ownerId', 'metal_rate', 'energia_rate', 'comida_rate', 'resources'];

    protected $fillable = [
        'jogador_id',
        'nome',
        'coordenada_x',
        'coordenada_y',
        'qg_nivel',
        'muralha_nivel',
        'recursos_metal',
        'recursos_energia',
        'recursos_comida',
        'last_update_at',
        'ultimo_update',
        'is_protected',
        'protection_until',
        'loyalty'
    ];

    protected $casts = [
        'is_protected' => 'boolean',
        'protection_until' => 'datetime',
        'last_update_at' => 'datetime',
        'ultimo_update' => 'datetime',
        'loyalty' => 'integer',
        'recursos_metal' => 'decimal:2',
        'recursos_energia' => 'decimal:2',
        'recursos_comida' => 'decimal:2',
    ];

    public function getResourcesAttribute()
    {
        return app(GameService::class)->calculateResources($this);
    }

    public function getMetalRateAttribute()
    {
        return EconomyRules::calculateProductionPerMinute('metal', $this->obterNivelEdificio(BuildingType::MINA_METAL)) / 60;
    }

    public function getEnergiaRateAttribute()
    {
        return EconomyRules::calculateProductionPerMinute('energia', $this->obterNivelEdificio(BuildingType::CENTRAL_ENERGIA)) / 60;
    }

    public function getComidaRateAttribute()
    {
        return EconomyRules::calculateProductionPerMinute('comida', $this->obterNivelEdificio(BuildingType::FAZENDA)) / 60;
    }

    private function obterNivelEdificio($tipo)
    {
        if ($tipo === BuildingType::QG) return (int) ($this->qg_nivel ?? 0);
        if ($tipo === BuildingType::MURALHA) return (int) ($this->muralha_nivel ?? 0);
        return (int) ($this->edificios->where('tipo', $tipo)->first()?->nivel ?? 0);
    }

    public function jogador()
    {
        return $this->belongsTo(Jogador::class);
    }


    public function tropas()
    {
        return $this->hasMany(Tropas::class);
    }

    public function edificios()
    {
        return $this->hasMany(Edificio::class);
    }

    public function construcoes()
    {
        return $this->hasMany(Construcao::class, 'base_id');
    }

    public function treinos()
    {
        return $this->hasMany(Treino::class, 'base_id');
    }

    /* Mapeamento Táctico para ECS Interface */
    public function getOwnerIdAttribute()
    {
        return $this->attributes['jogador_id'] ?? null;
    }
}
