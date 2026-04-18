<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Fatores de Crescimento Exponencial (FASE 14 — BALANCEAMENTO PROFISSIONAL)
    |--------------------------------------------------------------------------
    */

    'buildings' => [
        'cost_multiplier' => 1.6,         // Fator exponencial para custos: base * (1.6 ^ (level-1))
        'time_multiplier' => 1.5,         // Fator exponencial para tempo: base * (1.5 ^ (level-1))
        'hq_reduction_per_level' => 0.04,  // 4% de redução de tempo por nível de QG (v2)
    ],

    'production' => [
        'exponent' => 1.2,                // Produção: base * (level ^ 1.2)
    ],

    'storage' => [
        'base' => 10000,                   // Capacidade base
        'factor' => 1.25,                 // Fator: base * (1.25 ^ level)
    ],

    'units' => [
        'cost_increase_per_level' => 0.05, // Aumento de custo de 5% por nível de Quartel/Aeródromo
        'time_reduction_per_level' => 0.03, // 3% de redução de tempo de treino por nível de edifício produtor
    ],
];
