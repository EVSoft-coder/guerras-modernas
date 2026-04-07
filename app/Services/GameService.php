<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Edificio;
use App\Models\Construcao;
use App\Models\Treino;
use App\Models\Tropas;
use Illuminate\Support\Carbon;

class GameService
{
    /**
     * Calcula o tempo necessário para uma construção em segundos (Speed Mode).
     */
    public static function tempoConstrucao($tipo, $nivelAlvo)
    {
        $baseTime = 60; // 60 segundos base
        $speed = config('game.speed.construction', 1);
        
        // Exemplo de curva de tempo: (tempo_base * nivel) / speed
        return max(5, ($baseTime * $nivelAlvo) / $speed);
    }

    /**
     * Inicia uma nova construção na fila.
     */
    public function iniciarConstrucao(Base $base, $tipo)
    {
        // Verificar se já existe algo na fila para esta base (ainda não terminado)
        if ($base->construcoes()->where('completado_em', '>', now())->exists()) {
            throw new \Exception("Já existe uma construção em andamento nesta base.");
        }

        // Traduzir tipo visual para chave de config se necessário
        $tipoKey = str_replace(' ', '_', strtolower($tipo));
        if ($tipoKey == 'refinaria') $tipoKey = 'refinaria'; // exemplo
        
        $conf = config("game.buildings.{$tipoKey}");
        if (!$conf) throw new \Exception("Edifício desconhecido ($tipoKey).");

        $nivelAtual = $base->edificios()->where('tipo', $tipo)->first()?->nivel ?? 0;
        $nivelAlvo = $nivelAtual + 1;

        // Debitar Recursos
        $recursos = $base->recursos;
        $scaling = config('game.scaling', 1.5);
        
        foreach ($conf['cost'] as $res => $baseAmount) {
            $cost = floor($baseAmount * pow($nivelAlvo, $scaling));
            if ($recursos->$res < $cost) {
                throw new \Exception("Suprimentos insuficientes para nível {$nivelAlvo} de {$tipo}.");
            }
        }

        foreach ($conf['cost'] as $res => $baseAmount) {
            $cost = floor($baseAmount * pow($nivelAlvo, $scaling));
            $recursos->decrement($res, $cost);
        }

        $speed = config('game.speed.construction', 1);
        $segundos = ($conf['time_base'] * $nivelAlvo) / $speed;
        $completadoEm = now()->addSeconds($segundos);

        return $base->construcoes()->create([
            'edificio_tipo' => $tipo,
            'nivel_destino' => $nivelAlvo,
            'completado_em' => $completadoEm,
        ]);
    }

    /**
     * Inicia o treino de uma unidade técnica.
     */
    public function iniciarTreino(Base $base, $unidade, $quantidade)
    {
        $unitConf = config("game.units.{$unidade}");
        if (!$unitConf) throw new \Exception("Unidade desconhecida.");

        $recursos = $base->recursos;
        foreach ($unitConf['cost'] as $res => $amount) {
            $total = $amount * $quantidade;
            if ($recursos->$res < $total) {
                throw new \Exception("Recursos insuficientes.");
            }
        }

        foreach ($unitConf['cost'] as $res => $amount) {
            $recursos->decrement($res, $amount * $quantidade);
        }

        $speed = config('game.speed.training', 1);
        $segundos = ($unitConf['time'] * $quantidade) / $speed;
        $completadoEm = now()->addSeconds($segundos);

        return $base->treinos()->create([
            'unidade' => $unidade,
            'quantidade' => $quantidade,
            'completado_em' => $completadoEm,
        ]);
    }

    /**
     * Verifica e finaliza construções e treinos terminados.
     */
    public function processarFila(Base $base)
    {
        // 1. Processar Construções
        $construcoes = $base->construcoes()
            ->where('completado_em', '<=', now())
            ->get();

        foreach ($construcoes as $fila) {
            $edificio = $base->edificios()->where('tipo', $fila->edificio_tipo)->first();
            
            if ($edificio) {
                $edificio->update(['nivel' => $fila->nivel_destino]);
            } else {
                $base->edificios()->create([
                    'tipo' => $fila->edificio_tipo,
                    'nivel' => $fila->nivel_destino,
                ]);
            }

            $fila->delete();
        }

        // 2. Processar Treino de Tropas
        $treinos = $base->treinos()
            ->where('completado_em', '<=', now())
            ->get();

        foreach ($treinos as $treino) {
            $tropa = $base->tropas()->where('unidade', $treino->unidade)->first();
            
            if ($tropa) {
                $tropa->update(['quantidade' => $tropa->quantidade + $treino->quantidade]);
            } else {
                $base->tropas()->create([
                    'unidade' => $treino->unidade,
                    'quantidade' => $treino->quantidade,
                ]);
            }

            $treino->delete();
        }
    }
}
