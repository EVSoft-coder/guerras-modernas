<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Fatores de Crescimento Exponencial (FASE 14 — BALANCEAMENTO PROFISSIONAL)
    |--------------------------------------------------------------------------
    */

    'buildings' => [
        'cost_multiplier' => 1.6,         // Fator exponencial genérico
        'time_multiplier' => 1.1,         // Fator exponencial para tempo (Muito mais rápido em níveis altos)
        'hq_reduction_per_level' => 0.10,  // 10% de redução de tempo por nível de QG
        
        'upgrade_costs' => [
            'hq'               => ['base' => ['suprimentos' => 500, 'combustivel' => 200, 'pessoal' => 20], 'factor' => 1.6],
            'muralha'          => ['base' => ['suprimentos' => 400, 'municoes' => 200, 'pessoal' => 5], 'factor' => 1.4],
            'mina_suprimentos' => ['base' => ['suprimentos' => 200, 'combustivel' => 50, 'pessoal' => 10], 'factor' => 1.3],
            'refinaria'        => ['base' => ['suprimentos' => 300, 'municoes' => 100, 'pessoal' => 15], 'factor' => 1.25],
            'fabrica_municoes' => ['base' => ['suprimentos' => 250, 'combustivel' => 100, 'pessoal' => 12], 'factor' => 1.25],
            'mina_metal'       => ['base' => ['suprimentos' => 300, 'combustivel' => 100, 'pessoal' => 10], 'factor' => 1.3],
            'central_energia'  => ['base' => ['suprimentos' => 200, 'pessoal' => 5], 'factor' => 1.2],
            'housing'          => ['base' => ['suprimentos' => 150, 'pessoal' => 0], 'factor' => 1.15],
            'quartel'          => ['base' => ['suprimentos' => 600, 'combustivel' => 200, 'municoes' => 200, 'pessoal' => 20], 'factor' => 1.5],
            'aerodromo'        => ['base' => ['suprimentos' => 1000, 'combustivel' => 800, 'municoes' => 500, 'pessoal' => 30], 'factor' => 1.8],
            'radar_estrategico'=> ['base' => ['suprimentos' => 1500, 'combustivel' => 1200, 'municoes' => 300, 'pessoal' => 15], 'factor' => 1.6],
            'centro_pesquisa'  => ['base' => ['suprimentos' => 2000, 'combustivel' => 1000, 'municoes' => 1000, 'pessoal' => 40], 'factor' => 1.6],
            'posto_recrutamento'=> ['base' => ['suprimentos' => 400, 'combustivel' => 50, 'municoes' => 50, 'pessoal' => 5], 'factor' => 1.4],
            'parlamento'       => ['base' => ['suprimentos' => 5000, 'metal' => 5000, 'pessoal' => 10], 'factor' => 2.0],
        ],
    ],

    'production' => [
        'resource_buildings' => [
            'mina_suprimentos' => ['base' => 30, 'factor' => 1.163],
            'refinaria'        => ['base' => 25, 'factor' => 1.155],
            'fabrica_municoes' => ['base' => 20, 'factor' => 1.14],
            'mina_metal'       => ['base' => 25, 'factor' => 1.17],
            'central_energia'  => ['base' => 35, 'factor' => 1.16],
            'housing'          => ['base' => 15, 'factor' => 1.1], // Extra para pessoal
        ],
    ],

    'storage' => [
        'base' => 800,                    // Capacidade base (800 * 1.25^1 = 1000 no Nivel 1)
        'factor' => 1.25,                 // Fator: base * (1.25 ^ level)
    ],

    'units' => [
        'cost_increase_per_level' => 0.05, // Aumento de custo de 5% por nível de Quartel/Aeródromo
        'time_reduction_per_level' => 0.08, // 8% de redução de tempo de treino por nível de edifício produtor
    ],
];
