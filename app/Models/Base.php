<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Base extends Model
{
    use HasFactory;

    protected $table = 'bases';

    protected $fillable = [
        'jogador_id',
        'nome',
        'coordenada_x',
        'coordenada_y',
        'qg_nivel',
        'muralha_nivel',
        'ultimo_update',
    ];

    public function jogador()
    {
        return $this->belongsTo(Jogador::class);
    }

    public function recursos()
    {
        return $this->hasOne(Recurso::class);
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

    /**
     * Atualiza os recursos da base de acordo com o tempo decorrido
     * e os níveis dos edifícios produtores (Speed Mode suportado).
     */
    public function atualizarRecursos()
    {
        $agora = now();
        $ultimoUpdate = $this->ultimo_update ? \Illuminate\Support\Carbon::parse($this->ultimo_update) : $this->created_at;
        $segundos = $agora->diffInSeconds($ultimoUpdate);
        $horas = $segundos / 3600;

        if ($horas <= 0) return;

        $recursos = $this->recursos;
        if (!$recursos) {
            $recursos = $this->recursos()->create([
                'suprimentos' => 500,
                'combustivel' => 500,
                'municoes' => 500,
                'pessoal' => 100
            ]);
        }

        $speed = config('game.speed.resources', 1);
        $baseProd = config('game.production');

        // Níveis dos edifícios produtores
        $edificios = $this->edificios()->get();
        $niveis = [
            'mina_suprimentos' => $edificios->where('tipo', 'mina_suprimentos')->first()?->nivel ?? 0,
            'refinaria' => $edificios->where('tipo', 'refinaria')->first()?->nivel ?? 0,
            'fabrica_municoes' => $edificios->where('tipo', 'fabrica_municoes')->first()?->nivel ?? 0,
            'posto_recrutamento' => $edificios->where('tipo', 'posto_recrutamento')->first()?->nivel ?? 0,
        ];

        // Cálculo da produção: (Base + (Nível * Incremento)) * Multiplicador Speed * Tempo
        $prodSuprimentos = ($baseProd['suprimentos'] + ($niveis['mina_suprimentos'] * 20)) * $speed * $horas;
        $prodCombustivel = ($baseProd['combustivel'] + ($niveis['refinaria'] * 15)) * $speed * $horas;
        $prodMunicoes = ($baseProd['municoes'] + ($niveis['fabrica_municoes'] * 12)) * $speed * $horas;
        $prodPessoal = ($baseProd['pessoal'] + ($niveis['posto_recrutamento'] * 10)) * $speed * $horas;

        $recursos->update([
            'suprimentos' => $recursos->suprimentos + (int)$prodSuprimentos,
            'combustivel' => $recursos->combustivel + (int)$prodCombustivel,
            'municoes' => $recursos->municoes + (int)$prodMunicoes,
            'pessoal' => $recursos->pessoal + (int)$prodPessoal,
        ]);

        $this->update(['ultimo_update' => $agora]);
    }
}