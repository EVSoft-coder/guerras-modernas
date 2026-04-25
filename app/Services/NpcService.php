<?php

namespace App\Services;

use App\Models\Base;
use App\Models\Recurso;
use App\Models\Edificio;
use App\Models\Unit;
use App\Models\UnitType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * NpcService - Geração e Gestão de Aldeias Bárbaras.
 * Gera aldeias NPC no mapa (jogador_id = NULL) para saque/conquista.
 */
class NpcService
{
    /**
     * Gera N aldeias NPC espalhadas pelo mapa.
     */
    public function generateNpcVillages(int $count = 300, int $mapWidth = 1000): int
    {
        $generated = 0;
        $existingCoords = Base::select('coordenada_x', 'coordenada_y')
            ->get()
            ->map(fn($b) => "{$b->coordenada_x},{$b->coordenada_y}")
            ->toArray();

        $npcNames = [
            'Reduto Insurgente', 'Acampamento Rebelde', 'Posto Avançado',
            'Base Abandonada', 'Bunker Desertado', 'Silo de Munições',
            'Depósito Militar', 'Torre de Vigia', 'Complexo Subterrâneo',
            'Forte Operacional', 'Estação de Radar', 'Centro Logístico',
            'Campo de Treino', 'Refúgio Tático', 'Barricada Defensiva',
        ];

        $unitTypes = UnitType::all()->keyBy('name');
        $infantariaId = $unitTypes->get('infantaria')?->id;

        DB::transaction(function () use ($count, $mapWidth, $existingCoords, $npcNames, $infantariaId, &$generated) {
            for ($i = 0; $i < $count; $i++) {
                $attempts = 0;
                do {
                    $x = rand(10, $mapWidth - 10);
                    $y = rand(10, $mapWidth - 10);
                    $key = "{$x},{$y}";
                    $attempts++;
                } while (in_array($key, $existingCoords) && $attempts < 20);

                if ($attempts >= 20) continue;

                $existingCoords[] = $key;
                $nameIndex = array_rand($npcNames);
                $suffix = rand(100, 999);

                // Nível aleatório da aldeia NPC (1-5)
                $villageLevel = rand(1, 5);

                $base = Base::create([
                    'jogador_id' => null,
                    'nome' => "{$npcNames[$nameIndex]} #{$suffix}",
                    'coordenada_x' => $x,
                    'coordenada_y' => $y,
                    'x' => $x,
                    'y' => $y,
                    'ultimo_update' => now(),
                    'is_protected' => false,
                    'loyalty' => 100,
                ]);

                // Recursos proporcionais ao nível
                Recurso::create([
                    'base_id' => $base->id,
                    'suprimentos' => rand(200, 500) * $villageLevel,
                    'combustivel' => rand(100, 300) * $villageLevel,
                    'municoes' => rand(100, 200) * $villageLevel,
                    'metal' => rand(50, 150) * $villageLevel,
                    'energia' => rand(50, 100) * $villageLevel,
                    'pessoal' => 0,
                    'storage_capacity' => 5000 * $villageLevel,
                ]);

                // Edifícios mínimos (nível proporcional)
                $buildings = [
                    ['tipo' => 'hq', 'nivel' => $villageLevel, 'pos_x' => 1, 'pos_y' => 1],
                    ['tipo' => 'muralha', 'nivel' => max(0, $villageLevel - 1), 'pos_x' => 1, 'pos_y' => 2],
                    ['tipo' => 'mina_suprimentos', 'nivel' => $villageLevel, 'pos_x' => 2, 'pos_y' => 1],
                ];

                foreach ($buildings as $b) {
                    if ($b['nivel'] > 0) {
                        Edificio::create([
                            'base_id' => $base->id,
                            'tipo' => $b['tipo'],
                            'nivel' => $b['nivel'],
                            'pos_x' => $b['pos_x'],
                            'pos_y' => $b['pos_y'],
                        ]);
                    }
                }

                // Infantaria de defesa (10-50 * nível)
                if ($infantariaId) {
                    Unit::create([
                        'base_id' => $base->id,
                        'unit_type_id' => $infantariaId,
                        'quantity' => rand(10, 50) * $villageLevel,
                    ]);
                }

                $generated++;
            }
        });

        Log::channel('game')->info("[NPC_GENERATION] Geradas {$generated} aldeias NPC no mapa.");
        return $generated;
    }

    /**
     * Conta aldeias NPC existentes.
     */
    public function countNpcVillages(): int
    {
        return Base::whereNull('jogador_id')->count();
    }

    /**
     * Faz crescer lentamente os recursos e tropas das aldeias NPC.
     * Chamar periodicamente (ex: via cron a cada hora).
     */
    public function growNpcVillages(): int
    {
        $npcs = Base::whereNull('jogador_id')->with(['recursos', 'units'])->get();
        $grown = 0;

        foreach ($npcs as $base) {
            if ($base->recursos) {
                $cap = $base->recursos->storage_capacity ?? 5000;
                $base->recursos->update([
                    'suprimentos' => min($cap, $base->recursos->suprimentos + rand(20, 50)),
                    'combustivel' => min($cap, $base->recursos->combustivel + rand(10, 30)),
                    'municoes' => min($cap, $base->recursos->municoes + rand(10, 20)),
                ]);
            }

            // Crescimento de tropas (máximo 200 infantaria)
            $infantry = $base->units->first();
            if ($infantry && $infantry->quantity < 200) {
                $infantry->increment('quantity', rand(1, 3));
            }

            $grown++;
        }

        return $grown;
    }
}
