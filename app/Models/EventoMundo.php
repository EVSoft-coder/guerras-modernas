<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventoMundo extends Model
{
    protected $table = 'eventos_mundo';

    protected $fillable = [
        'nome',
        'descricao',
        'tipo_evento',
        'multiplicador',
        'inicia_em',
        'termina_em',
        'ativo'
    ];

    protected $casts = [
        'inicia_em' => 'datetime',
        'termina_em' => 'datetime',
        'ativo' => 'boolean',
        'multiplicador' => 'float',
    ];

    /**
     * Retorna os eventos atualmente ativos
     */
    public static function ativos()
    {
        return self::where('ativo', true)
            ->where(function ($query) {
                $query->whereNull('inicia_em')
                      ->orWhere('inicia_em', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('termina_em')
                      ->orWhere('termina_em', '>=', now());
            })
            ->get();
    }

    /**
     * Retorna o multiplicador ativo para um dado tipo de evento.
     * Retorna 1.0 se não houver evento desse tipo ativo.
     */
    public static function getMultiplicadorAtivo(string $tipo)
    {
        $evento = self::ativos()->where('tipo_evento', $tipo)->first();
        return $evento ? $evento->multiplicador : 1.0;
    }
}
