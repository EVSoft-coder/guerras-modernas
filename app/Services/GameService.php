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

        // Mapeamento robusto de edifícios (suporta nomes técnicos e amigáveis)
        $tiposMapeados = [
            'mina de suprimentos' => 'mina_suprimentos',
            'refinaria de combustível' => 'refinaria',
            'fábrica de munições' => 'fabrica_municoes',
            'posto de recrutamento' => 'posto_recrutamento',
            'quartel regional' => 'quartel',
            'aeródromo militar' => 'aerodromo',
            'radar de longo alcance' => 'radar_estrategico',
            'centro de pesquisa & i&d' => 'centro_pesquisa'
        ];

        $tipoKey = str_replace(['_', '-'], ' ', strtolower($tipo));
        if (isset($tiposMapeados[$tipoKey])) {
            $tipoKey = $tiposMapeados[$tipoKey];
        } else {
            $tipoKey = str_replace(' ', '_', strtolower($tipo));
        }
        
        $conf = config("game.buildings.{$tipoKey}");
        if (!$conf) throw new \Exception("Edifício desconhecido ($tipoKey).");

        $nivelAtual = $base->edificios()->where('tipo', $tipoKey)->first()?->nivel ?? 0;
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
            'edificio_tipo' => $tipoKey,
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
        
        // CÁLCULO DE CAPACIDADE DE PESSOAL (POPULAÇÃO)
        $nivelRecrutamento = $base->edificios()->where('tipo', 'posto_recrutamento')->first()?->nivel ?? 0;
        $capacidadeBase = (100 * ($nivelRecrutamento + 1)) * 1.5; // Ex: Lvl 0 = 150, Lvl 1 = 300, etc.

        // APLICAR TECH: Logística Avançada (+10% capacidade por nível)
        $nivelLogistica = $base->jogador->obterNivelTech('logistica');
        $multiplicadorCap = 1 + ($nivelLogistica * 0.10);
        $capacidadeTotal = $capacidadeBase * $multiplicadorCap;
        
        $pessoalOcupado = 0;
        $tropasAtuais = $base->tropas;
        foreach ($tropasAtuais as $t) {
            $pessoalOcupado += ($t->quantidade * (config("game.units.{$t->unidade}.cost.pessoal") ?? 1));
        }
        
        $pessoalNovo = $quantidade * ($unitConf['cost']['pessoal'] ?? 1);
        
        if (($pessoalOcupado + $pessoalNovo) > $capacidadeTotal) {
            throw new \Exception("Capacidade de aquartelamento insuficiente. Melhore o Posto de Recrutamento.");
        }

        foreach ($unitConf['cost'] as $res => $amount) {
            $total = $amount * $quantidade;
            if ($recursos->$res < $total) {
                throw new \Exception("Recursos insuficientes.");
            }
            $recursos->decrement($res, $total);
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
     * Inicia uma nova pesquisa tecnológica (Nível de Comando).
     */
    public function iniciarPesquisa(Base $base, $tipo)
    {
        $jogador = $base->jogador;
        
        // Verificar se Laboratório existe e nível
        $laboratorio = $base->edificios()->where('tipo', 'centro_pesquisa')->first();
        if (!$laboratorio || $laboratorio->nivel < 1) {
            throw new \Exception("Necessita de um Centro de Pesquisa operacional (Nível 1) para iniciar I&D.");
        }

        // Verificar se já existe pesquisa em andamento para este JOGADOR
        if (\App\Models\Pesquisa::where('jogador_id', $jogador->id)->where('completado_em', '>', now())->exists()) {
            throw new \Exception("O seu departamento de I&D já está ocupado com outro projeto.");
        }

        $conf = config("game.research.{$tipo}");
        if (!$conf) throw new \Exception("Tecnologia desconhecida ($tipo).");

        $nivelAtual = \App\Models\Pesquisa::where('jogador_id', $jogador->id)->where('tipo', $tipo)->orderBy('nivel', 'desc')->first()?->nivel ?? 0;
        $nivelAlvo = $nivelAtual + 1;

        // Debitar Recursos (Escala 2x por nível)
        $recursos = $base->recursos;
        foreach ($conf['cost'] as $res => $baseAmount) {
            $cost = floor($baseAmount * pow($nivelAlvo, 1.8));
            if ($recursos->$res < $cost) {
                throw new \Exception("Recursos insuficientes na base para financiar esta pesquisa.");
            }
        }

        $speed = config('game.speed.construction', 1);
        $segundos = ($conf['time_base'] * $nivelAlvo) / $speed;
        $completadoEm = now()->addSeconds($segundos);

        return \Illuminate\Support\Facades\DB::transaction(function() use ($jogador, $tipo, $nivelAlvo, $completadoEm, $recursos, $conf) {
            foreach ($conf['cost'] as $res => $baseAmount) {
                $cost = floor($baseAmount * pow($nivelAlvo, 1.8));
                $recursos->decrement($res, $cost);
            }

            return \App\Models\Pesquisa::create([
                'jogador_id'    => $jogador->id,
                'tipo'          => $tipo,
                'nivel'         => $nivelAlvo,
                'completado_em' => $completadoEm,
            ]);
        });
    }

    /**
     * Verifica e finaliza construções e treinos terminados.
     */
    public function processarFila(Base $base)
    {
        \Illuminate\Support\Facades\DB::transaction(function () use ($base) {
            // 1. Processar Construções
            $construcoes = $base->construcoes()
                ->where('completado_em', '<=', now())
                ->lockForUpdate()
                ->get();

            foreach ($construcoes as $fila) {
                $edificio = $base->edificios()->where('tipo', $fila->edificio_tipo)->lockForUpdate()->first();
                
                if ($edificio) {
                    $edificio->update(['nivel' => $fila->nivel_destino]);
                } else {
                    $base->edificios()->create([
                        'tipo' => $fila->edificio_tipo,
                        'nivel' => $fila->nivel_destino,
                    ]);
                }

                // GANHA XP: Nível * 10
                if (\Illuminate\Support\Facades\Schema::hasColumn('jogadores', 'xp')) {
                    $base->jogador->increment('xp', $fila->nivel_destino * 10);
                }

                $fila->delete();
            }

            // 2. Processar Treino de Tropas
            $treinos = $base->treinos()
                ->where('completado_em', '<=', now())
                ->lockForUpdate()
                ->get();

            foreach ($treinos as $treino) {
                $tropa = $base->tropas()->where('unidade', $treino->unidade)->lockForUpdate()->first();
                
                if ($tropa) {
                    $tropa->update(['quantidade' => $tropa->quantidade + $treino->quantidade]);
                } else {
                    $base->tropas()->create([
                        'unidade' => $treino->unidade,
                        'quantidade' => $treino->quantidade,
                    ]);
                }

                // GANHA XP baseado no tempo de treino
                if (\Illuminate\Support\Facades\Schema::hasColumn('jogadores', 'xp')) {
                    $unitConf = config("game.units.{$treino->unidade}");
                    $xpGanho = (int)(($unitConf['time'] * $treino->quantidade) / 60);
                    $base->jogador->increment('xp', max(1, $xpGanho));
                }

                $treino->delete();
            }

            // 3. Processar Pesquisas Tecnológicas (Global do Jogador)
            $pesquisas = \App\Models\Pesquisa::where('jogador_id', $base->jogador_id)
                ->where('completado_em', '<=', now())
                ->get();

            foreach ($pesquisas as $p) {
                // Notificar? Por agora apenas completa (completado_em <= now já é o flag de sucesso)
                // XP por Pesquisa
                if (\Illuminate\Support\Facades\Schema::hasColumn('jogadores', 'xp')) {
                    $base->jogador->increment('xp', $p->nivel * 50);
                }
                
                // Manter o registro mas talvez com flag 'terminada'?
                // Para simplificar, o sistema olha para o nível mais alto terminado.
            }
        });
    }

    /**
     * Motor de Produção: Atualiza os recursos da base com base no tempo decorrido.
     */
    public function atualizarRecursos(Base $base)
    {
        $recursos = $base->recursos;
        if (!$recursos) return;

        // NUCLEAR OPTION: Atualização atómica baseada no relógio interno do MySQL
        // Esto elimina qualquer discrepância entre o relógio do PHP e o relógio da BD
        try {
            $config = config('game');
            $speed = $config['speed']['resources'] ?? 1;
            $scaling = $config['scaling'] ?? 1.5;
            
            $tiposLink = [
                'suprimentos' => 'mina_suprimentos',
                'combustivel' => 'refinaria',
                'municoes' => 'fabrica_municoes',
                'pessoal' => 'posto_recrutamento'
            ];

            $rates = [];
            foreach ($tiposLink as $res => $edificioTipo) {
                // Procurar edifício diretamente na BD para evitar cache
                $edificio = \App\Models\Edificio::where('base_id', $base->id)->where('tipo', $edificioTipo)->first();
                $nivel = $edificio ? $edificio->nivel : 0;
                $baseProd = $config['production'][$res] ?? 10;
                // Taxa por segundo (Base * Speed * (1 + Nivel * Scaling) / 3600)
                $rates[$res] = (($baseProd * $speed) * (1 + ($nivel * $scaling))) / 3600;
            }

            // Executar UPDATE atómico no MySQL usando TIMESTAMPDIFF
            // Nota: COALESCE garante que se updated_at for NULL, usamos o tempo de criação ou NOW
            \Illuminate\Support\Facades\DB::statement("
                UPDATE recursos 
                SET suprimentos = suprimentos + (? * GREATEST(0, TIMESTAMPDIFF(SECOND, COALESCE(updated_at, created_at, NOW()), NOW()))),
                    combustivel = combustivel + (? * GREATEST(0, TIMESTAMPDIFF(SECOND, COALESCE(updated_at, created_at, NOW()), NOW()))),
                    municoes    = municoes    + (? * GREATEST(0, TIMESTAMPDIFF(SECOND, COALESCE(updated_at, created_at, NOW()), NOW()))),
                    pessoal     = pessoal     + (? * GREATEST(0, TIMESTAMPDIFF(SECOND, COALESCE(updated_at, created_at, NOW()), NOW()))),
                    updated_at  = NOW()
                WHERE base_id = ?
            ", [
                $rates['suprimentos'], 
                $rates['combustivel'], 
                $rates['municoes'], 
                $rates['pessoal'], 
                $base->id
            ]);

            // Sincronizar a instância em memória para que o Dashboard mostre os valores atuais da BD desta transação
            $base->refresh();
            $base->load('recursos');
        } catch (\Exception $e) {
            \Log::error("Falha na Sincronização Atómica Base {$base->id}: " . $e->getMessage());
        }
    }

    /**
     * Calcula as taxas de produção atuais por minuto para a base.
     */
    public function obterTaxasProducao(Base $base)
    {
        $config = config('game');
        $speed = $config['speed']['resources'] ?? 1;
        $scaling = $config['scaling'] ?? 1.5;
        
        $tiposLink = [
            'suprimentos' => 'mina_suprimentos',
            'combustivel' => 'refinaria',
            'municoes' => 'fabrica_municoes',
            'pessoal' => 'posto_recrutamento'
        ];

        $taxas = [];
        foreach ($tiposLink as $res => $edificioTipo) {
            $nivel = $base->edificios()->where('tipo', $edificioTipo)->first()?->nivel ?? 0;
            $baseProd = $config['production'][$res] ?? 10;
            
            // Formula: (BasePerHour * Speed) * (1 + Level * Scaling)
            $porHora = ($baseProd * $speed) * (1 + ($nivel * $scaling));
            $taxas[$res] = floor($porHora / 60);
        }

        return $taxas;
    }
}
