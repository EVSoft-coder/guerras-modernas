<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Game Speed Settings
    |--------------------------------------------------------------------------
    | Modificadores que afetam a velocidade do jogo (estilo Speed Mode).
    */
    'speed' => [
        'resources' => 10,     // 10x mais rápido
        'construction' => 10,  // 10x mais rápido
        'training' => 10,      // 10x mais rápido
        'travel' => 5,         // 5x mais rápido
    ],

    /*
    |--------------------------------------------------------------------------
    | Base Production Settings
    |--------------------------------------------------------------------------
    | Quantidade base por hora produzida pelos edifícios de recursos (nível 0).
    */
    'production' => [
        'suprimentos' => 50,
        'combustivel' => 40,
        'municoes' => 30,
        'pessoal' => 20,
    ],

    /*
    |--------------------------------------------------------------------------
    | Scaling Factor
    |--------------------------------------------------------------------------
    | Como a produção escala com o nível do edifício (ex: level^1.5).
    | Produção = Base * (level * factor)
    */
    'scaling' => 1.5,

    /*
    |--------------------------------------------------------------------------
    | Unit Definitions
    |--------------------------------------------------------------------------
    */
    'units' => [
        'infantaria' => [
            'name' => 'Infantaria de Assalto',
            'cost' => ['suprimentos' => 100, 'municoes' => 20, 'pessoal' => 1],
            'time' => 30, // segundos base
            'attack' => 10,
            'defense_general' => 15,
            'defense_armored' => 5,
            'speed' => 10,
            'capacity' => 20,
        ],
        'blindado_apc' => [
            'name' => 'Transporte APC',
            'cost' => ['suprimentos' => 300, 'combustivel' => 100, 'municoes' => 50, 'pessoal' => 2],
            'time' => 120,
            'attack' => 20,
            'defense_general' => 40,
            'defense_armored' => 30,
            'speed' => 25,
            'capacity' => 100,
        ],
        'tanque_combate' => [
            'name' => 'Tanque de Combate (MBT)',
            'cost' => ['suprimentos' => 800, 'combustivel' => 300, 'municoes' => 200, 'pessoal' => 4],
            'time' => 600,
            'attack' => 150,
            'defense_general' => 100,
            'defense_armored' => 120,
            'speed' => 20,
            'capacity' => 50,
        ],
        'helicoptero_ataque' => [
            'name' => 'Helicóptero Apache',
            'cost' => ['suprimentos' => 1500, 'combustivel' => 800, 'municoes' => 500, 'pessoal' => 2],
            'time' => 1800,
            'attack' => 300,
            'defense_general' => 50,
            'defense_armored' => 40,
            'speed' => 60,
            'capacity' => 0,
        ],
    ],
];
