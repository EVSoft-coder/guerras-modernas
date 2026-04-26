<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Fatores de Crescimento Exponencial (FASE 14 — BALANCEAMENTO PROFISSIONAL)
    |--------------------------------------------------------------------------
    */

    'buildings' => [
        'cost_multiplier' => 1.4,         // Reduzido (de 1.6) para progressão mais fácil
        'time_multiplier' => 1.05,        // Reduzido (de 1.1) para tempos mais curtos em níveis altos
        'hq_reduction_per_level' => 0.15,  // 15% de redução (de 10%) por nível de QG
        
        'upgrade_costs' => [
            'hq'               => ['base' => ['suprimentos' => 500, 'combustivel' => 200, 'pessoal' => 20], 'factor' => 1.4],
            'muralha'          => ['base' => ['suprimentos' => 400, 'municoes' => 200, 'pessoal' => 5], 'factor' => 1.3],
            'mina_suprimentos' => ['base' => ['suprimentos' => 200, 'combustivel' => 50, 'pessoal' => 10], 'factor' => 1.25],
            'refinaria'        => ['base' => ['suprimentos' => 300, 'municoes' => 100, 'pessoal' => 15], 'factor' => 1.2],
            'fabrica_municoes' => ['base' => ['suprimentos' => 250, 'combustivel' => 100, 'pessoal' => 12], 'factor' => 1.2],
            'mina_metal'       => ['base' => ['suprimentos' => 300, 'combustivel' => 100, 'pessoal' => 10], 'factor' => 1.25],
            'central_energia'  => ['base' => ['suprimentos' => 200, 'pessoal' => 5], 'factor' => 1.15],
            'housing'          => ['base' => ['suprimentos' => 150, 'pessoal' => 0], 'factor' => 1.1],
            'quartel'          => ['base' => ['suprimentos' => 600, 'combustivel' => 200, 'municoes' => 200, 'pessoal' => 20], 'factor' => 1.4],
            'aerodromo'        => ['base' => ['suprimentos' => 1000, 'combustivel' => 800, 'municoes' => 500, 'pessoal' => 30], 'factor' => 1.6],
            'radar_estrategico'=> ['base' => ['suprimentos' => 1500, 'combustivel' => 1200, 'municoes' => 300, 'pessoal' => 15], 'factor' => 1.5],
            'centro_pesquisa'  => ['base' => ['suprimentos' => 2000, 'combustivel' => 1000, 'municoes' => 1000, 'pessoal' => 40], 'factor' => 1.5],
            'posto_recrutamento'=> ['base' => ['suprimentos' => 400, 'combustivel' => 50, 'municoes' => 50, 'pessoal' => 5], 'factor' => 1.3],
            'parlamento'       => ['base' => ['suprimentos' => 5000, 'metal' => 5000, 'pessoal' => 10], 'factor' => 1.8],
        ],
    ],

    'production' => [
        'resource_buildings' => [
            'mina_suprimentos' => ['base' => 480, 'factor' => 1.32], // ~10/m lvl 1, ~130/m lvl 10
            'refinaria'        => ['base' => 400, 'factor' => 1.32], // ~8/m lvl 1, ~110/m lvl 10
            'fabrica_municoes' => ['base' => 360, 'factor' => 1.32], // ~7/m lvl 1, ~100/m lvl 10
            'mina_metal'       => ['base' => 440, 'factor' => 1.32], // ~9/m lvl 1, ~120/m lvl 10
            'central_energia'  => ['base' => 600, 'factor' => 1.32], // ~13/m lvl 1, ~160/m lvl 10
            'housing'          => ['base' => 100, 'factor' => 1.2],  // População: ~160 lvl 1, ~600 lvl 10
        ],
    ],

    'storage' => [
        'base' => 1000,                   // Capacidade base aumentada (de 800)
        'factor' => 1.3,                  // Fator aumentado para caber mais recursos
    ],

    'units' => [
        'cost_increase_per_level' => 0.03, // Aumento de custo reduzido (de 5%)
        'time_reduction_per_level' => 0.12, // 12% de redução (de 8%)
    ],
];
