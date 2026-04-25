<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventoMundo extends Model
{
    protected $table = 'eventos_mundo';

    protected $fillable = [
        'titulo',
        'descricao',
        'tipo',
        'dados',
        'expira_em'
    ];

    protected $casts = [
        'expira_em' => 'datetime',
        'dados' => 'array',
    ];

    /**
     * Retorna os eventos atualmente ativos
     */
    public static function ativos()
    {
        return self::where(function ($query) {
                $query->whereNull('expira_em')
                      ->orWhere('expira_em', '>=', now());
            })
            ->get()
            ->map(function ($evento) {
                // Compatibilidade com o Frontend e Serviços que esperam 'nome' e 'multiplicador'
                $evento->nome = $evento->titulo;
                $evento->multiplicador = $evento->dados['multiplicador'] ?? 1.0;
                return $evento;
            });
    }

    /**
     * Retorna o multiplicador ativo para um dado tipo de evento.
     * Retorna 1.0 se não houver evento desse tipo ativo.
     */
    public static function getMultiplicadorAtivo(string $tipo)
    {
        $evento = self::ativos()->where('tipo', $tipo)->first();
        return $evento ? $evento->multiplicador : 1.0;
    }
}
