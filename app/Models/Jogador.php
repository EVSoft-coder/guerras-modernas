<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\UnitType;
use App\Models\Unit;
use App\Models\UnitQueue;
use Illuminate\Support\Facades\DB;

class Jogador extends Authenticatable
{
    use Notifiable;

    protected $table = 'jogadores';

    protected $fillable = [
        'username',
        'email',
        'password',
        'nome',
        'alianca_id',
        'xp',
        'nivel',
        'cargo',
        'pontos_premium',
        'premium_until',
        'moedas',
    ];

    protected $casts = [
        'pontos_premium' => 'integer',
        'moedas' => 'integer',
        'premium_until' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function pesquisas()
    {
        return $this->hasMany(Pesquisa::class);
    }

    /**
     * Obtém o nível atual de uma tecnologia terminada.
     */
    public function obterNivelTech($tipo)
    {
        return $this->pesquisas()
            ->where('tipo', $tipo)
            ->where('completado_em', '<=', now())
            ->orderBy('nivel', 'desc')
            ->first()?->nivel ?? 0;
    }

    public function bases()
    {
        return $this->hasMany(Base::class);
    }

    public function alianca()
    {
        return $this->belongsTo(Alianca::class);
    }

    public function pedidosAlianca()
    {
        return $this->hasMany(PedidoAlianca::class, 'jogador_id');
    }

    public function general()
    {
        return $this->hasOne(General::class, 'jogador_id');
    }

    public function baseGroups()
    {
        return $this->hasMany(BaseGroup::class, 'jogador_id');
    }

    public function constructionTemplates()
    {
        return $this->hasMany(ConstructionTemplate::class, 'jogador_id');
    }

    /**
     * Verifica se o jogador ainda está sob proteção de novato.
     */
    public function sobProtecao()
    {
        $horasProtecao = config('game.speed.protection_hours', 24);
        return $this->created_at->addHours($horasProtecao)->isFuture();
    }

    public function ePremium()
    {
        return $this->premium_until && $this->premium_until->isFuture();
    }

    /**
     * FASE 4.1: Sistema de Moedas e Políticos (Nobre)
     * Baseado na mecânica clássica de Tribal Wars.
     */
    public function totalNobresCapacidade(): int
    {
        // Capacidade n: moedas >= n * (n + 1) / 2
        // n^2 + n - 2*moedas <= 0
        // Solução positiva: n = (-1 + sqrt(1 + 8*moedas)) / 2
        if ($this->moedas <= 0) return 0;
        return (int) floor((-1 + sqrt(1 + 8 * $this->moedas)) / 2);
    }

    public function nobresEmUso(): int
    {
        $tipoPolitico = UnitType::where('name', 'politico')->first();
        if (!$tipoPolitico) return 0;

        // 1. Nobres existentes nas bases
        $existentes = Unit::whereIn('base_id', $this->bases()->pluck('id'))
            ->where('unit_type_id', $tipoPolitico->id)
            ->sum('quantity');

        // 2. Nobres em fila de recrutamento
        $naFila = UnitQueue::whereIn('base_id', $this->bases()->pluck('id'))
            ->where('unit_type_id', $tipoPolitico->id)
            ->sum('quantity');

        // 3. Nobres em movimento (ataque/apoio)
        $emMovimento = DB::table('movement_units')
            ->join('movements', 'movement_units.movement_id', '=', 'movements.id')
            ->where('movements.jogador_id', $this->id)
            ->where('movement_units.unit_type_id', $tipoPolitico->id)
            ->sum('movement_units.quantity');

        // 4. Bases conquistadas (além da primeira)
        $basesConquistadas = max(0, $this->bases()->count() - 1);

        return (int) ($existentes + $naFila + $emMovimento + $basesConquistadas);
    }

    public function slotsNobresDisponiveis(): int
    {
        return max(0, $this->totalNobresCapacidade() - $this->nobresEmUso());
    }

    public function moedasParaProximoNobre(): int
    {
        $n = $this->totalNobresCapacidade() + 1;
        $totalNecessario = ($n * ($n + 1)) / 2;
        return (int) max(0, $totalNecessario - $this->moedas);
    }
}
