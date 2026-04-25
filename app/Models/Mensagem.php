<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mensagem extends Model
{
    protected $table = 'mensagens';

    protected $fillable = [
        'remetente_id',
        'destinatario_id',
        'assunto',
        'corpo',
        'tipo',
        'lida',
    ];

    protected $casts = [
        'lida' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function remetente()
    {
        return $this->belongsTo(Jogador::class, 'remetente_id');
    }

    public function destinatario()
    {
        return $this->belongsTo(Jogador::class, 'destinatario_id');
    }

    /**
     * Cria um relatório de ataque para ambos os jogadores.
     */
    public static function criarRelatorioAtaque(array $resultado): void
    {
        $atkId = $resultado['atacante_id'] ?? null;
        $defId = $resultado['defensor_id'] ?? null;
        $vitoria = $resultado['vitoria'] ?? false;
        $saqueStr = '';

        if (!empty($resultado['saque'])) {
            foreach ($resultado['saque'] as $recurso => $qtd) {
                if ($qtd > 0) $saqueStr .= "  • {$recurso}: +{$qtd}\n";
            }
        }

        $atkBase = $resultado['atk_base'] ?? '???';
        $defBase = $resultado['def_base'] ?? '???';
        $atkPerdas = $resultado['atk_perdas'] ?? 0;
        $defPerdas = $resultado['def_perdas'] ?? 0;

        // Relatório para o Atacante
        if ($atkId) {
            self::create([
                'remetente_id' => null,
                'destinatario_id' => $atkId,
                'assunto' => ($vitoria ? '⚔️ VITÓRIA' : '💀 DERROTA') . " — Ataque a {$defBase}",
                'corpo' => "=== RELATÓRIO DE COMBATE ===\n\n"
                    . "Operação: OFENSIVA\n"
                    . "Alvo: {$defBase}\n"
                    . "Resultado: " . ($vitoria ? 'VITÓRIA' : 'DERROTA') . "\n\n"
                    . "--- Baixas ---\n"
                    . "As suas perdas: {$atkPerdas} unidades\n"
                    . "Perdas inimigas: {$defPerdas} unidades\n\n"
                    . ($saqueStr ? "--- Saque ---\n{$saqueStr}\n" : "Sem saque.\n")
                    . "\n— Inteligência Militar",
                'tipo' => 'relatorio_ataque',
            ]);
        }

        // Relatório para o Defensor
        if ($defId) {
            self::create([
                'remetente_id' => null,
                'destinatario_id' => $defId,
                'assunto' => ($vitoria ? '🛡️ BASE ATACADA' : '🛡️ DEFESA BEM-SUCEDIDA') . " — {$defBase}",
                'corpo' => "=== RELATÓRIO DE COMBATE ===\n\n"
                    . "Operação: DEFENSIVA\n"
                    . "Base: {$defBase}\n"
                    . "Resultado: " . ($vitoria ? 'BASE INVADIDA' : 'DEFESA BEM-SUCEDIDA') . "\n\n"
                    . "--- Baixas ---\n"
                    . "As suas perdas: {$defPerdas} unidades\n"
                    . "Perdas inimigas: {$atkPerdas} unidades\n\n"
                    . ($vitoria && $saqueStr ? "--- Recursos Saqueados ---\n{$saqueStr}\n" : "")
                    . "\n— Inteligência Militar",
                'tipo' => 'relatorio_defesa',
            ]);
        }
    }
}
