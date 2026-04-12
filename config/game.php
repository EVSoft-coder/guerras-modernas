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
        'protection_hours' => 24, // Proteção de novato (24h)
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
        'metal' => 15,
        'energia' => 10,
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
    | Building Costs and Times
    |--------------------------------------------------------------------------
    */
    'buildings' => [
        'qg' => [
            'name' => 'Centro de Comando (QG)',
            'cost' => ['suprimentos' => 500, 'combustivel' => 200, 'pessoal' => 20],
            'time_base' => 120,
        ],
        'muralha' => [
            'name' => 'Perímetro Defensivo (Muralha)',
            'cost' => ['suprimentos' => 400, 'municoes' => 200, 'pessoal' => 5],
            'time_base' => 180,
        ],
        'mina_suprimentos' => [
            'name' => 'Mina de Suprimentos',
            'cost' => ['suprimentos' => 200, 'combustivel' => 50, 'pessoal' => 10],
            'time_base' => 60,
        ],
        'refinaria' => [
            'name' => 'Refinaria de Combustível',
            'cost' => ['suprimentos' => 300, 'municoes' => 100, 'pessoal' => 15],
            'time_base' => 90,
        ],
        'fabrica_municoes' => [
            'name' => 'Fábrica de Munições',
            'cost' => ['suprimentos' => 250, 'combustivel' => 100, 'pessoal' => 12],
            'time_base' => 120,
        ],
        'posto_recrutamento' => [
            'name' => 'Posto de Recrutamento',
            'cost' => ['suprimentos' => 400, 'combustivel' => 50, 'municoes' => 50, 'pessoal' => 5],
            'time_base' => 150,
        ],
        'quartel' => [
            'name' => 'Quartel Regional',
            'cost' => ['suprimentos' => 600, 'combustivel' => 200, 'municoes' => 200, 'pessoal' => 20],
            'time_base' => 300,
        ],
        'aerodromo' => [
            'name' => 'Aeródromo Militar',
            'cost' => ['suprimentos' => 1000, 'combustivel' => 800, 'municoes' => 500, 'pessoal' => 30],
            'time_base' => 600,
        ],
        'radar_estrategico' => [
            'name' => 'Radar de Longo Alcance',
            'cost' => ['suprimentos' => 1500, 'combustivel' => 1200, 'municoes' => 300, 'pessoal' => 15],
            'time_base' => 900,
        ],
        'centro_pesquisa' => [
            'name' => 'Centro de Pesquisa & I&D',
            'cost' => ['suprimentos' => 2000, 'combustivel' => 1000, 'municoes' => 1000, 'pessoal' => 40],
            'time_base' => 1200,
        ],
        'factory' => [
            'name' => 'Fábrica Metalúrgica',
            'cost' => ['suprimentos' => 500, 'combustivel' => 300, 'pessoal' => 20],
            'time_base' => 180,
        ],
        'solar' => [
            'name' => 'Planta de Energia Solar',
            'cost' => ['suprimentos' => 300, 'metal' => 200, 'pessoal' => 10],
            'time_base' => 120,
        ],
    ],

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
        'agente_espiao' => [
            'name' => 'Agente de Inteligência',
            'cost' => ['suprimentos' => 500, 'combustivel' => 100, 'municoes' => 50, 'pessoal' => 1],
            'time' => 600,
            'attack' => 0,
            'defense_general' => 1,
            'defense_armored' => 1,
            'speed' => 80,
            'capacity' => 0,
            'is_spy' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Research / Technology Tree
    |--------------------------------------------------------------------------
    */
    'research' => [
        'pontaria' => [
            'name' => 'Sistemas de Pontaria',
            'cost' => ['suprimentos' => 1000, 'municoes' => 500, 'pessoal' => 5],
            'time_base' => 1800,
            'bonus_per_level' => 0.05, // +5% Ataque
            'type' => 'attack',
        ],
        'blindagem' => [
            'name' => 'Blindagem Reativa',
            'cost' => ['suprimentos' => 1000, 'combustivel' => 500, 'pessoal' => 8],
            'time_base' => 1800,
            'bonus_per_level' => 0.05, // +5% Defesa
            'type' => 'defense',
        ],
        'logistica' => [
            'name' => 'Logística Avançada',
            'cost' => ['suprimentos' => 800, 'combustivel' => 800, 'pessoal' => 10],
            'time_base' => 1200,
            'bonus_per_level' => 0.10, // +10% Speed/Capacity
            'type' => 'utility',
        ],
    ],
];
