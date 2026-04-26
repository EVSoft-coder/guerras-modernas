<?php

return [
    /**
     * Configurações do Mapa e Mundo
     */
    'map' => [
        'width' => 1000,
        'height' => 1000,
        'unique_coords' => true,
    ],

    /**
     * Logística e Movimento
     */
    'movement' => [
        'base_speed' => 3.0, // Unidades de distância por segundo (Triplicado para velocidade extrema)
        'min_travel_time' => 10, // Mínimo de 10 segundos por viagem (Reduzido de 60s)
    ],

    /**
     * Outras configurações do jogo (Fase Avançada)
     */
    'production' => [
        'mina_suprimentos' => [
            'resource' => 'suprimentos',
            'base' => 480, 
            'factor' => 1.32,
        ],
        'refinaria' => [
            'resource' => 'combustivel',
            'base' => 400, 
            'factor' => 1.32,
        ],
        'fabrica_municoes' => [
            'resource' => 'municoes',
            'base' => 360, 
            'factor' => 1.32,
        ],
        'mina_metal' => [
            'resource' => 'metal',
            'base' => 440, 
            'factor' => 1.32,
        ],
        'central_energia' => [
            'resource' => 'energia',
            'base' => 600, 
            'factor' => 1.32,
        ],
        'housing' => [
            'resource' => 'pessoal',
            'base' => 100, 
            'factor' => 1.2,
        ],
    ],
    /**
     * Balanço de Edifícios (Regras de Economia e Engenharia)
     */
    'buildings' => [
        'hq' => [
            'name' => 'Centro de Comando (HQ)',
            'cost' => ['suprimentos' => 500, 'combustivel' => 200, 'pessoal' => 20],
            'time_base' => 15, // Reduzido (de 30)
            'scaling' => 1.5
        ],
        'muralha' => [
            'name' => 'Perímetro Defensivo (Muralha)',
            'cost' => ['suprimentos' => 400, 'municoes' => 200, 'pessoal' => 5],
            'time_base' => 20, // Reduzido (de 45)
            'scaling' => 1.3
        ],
        'mina_suprimentos' => [
            'name' => 'Mina de Suprimentos',
            'cost' => ['suprimentos' => 200, 'combustivel' => 50, 'pessoal' => 10],
            'time_base' => 7, // Reduzido (de 15)
            'scaling' => 1.2
        ],
        'refinaria' => [
            'name' => 'Refinaria de Combustível',
            'cost' => ['suprimentos' => 300, 'municoes' => 100, 'pessoal' => 15],
            'time_base' => 10, // Reduzido (de 20)
            'scaling' => 1.2
        ],
        'fabrica_municoes' => [
            'name' => 'Fábrica de Munições',
            'cost' => ['suprimentos' => 250, 'combustivel' => 100, 'pessoal' => 12],
            'time_base' => 12, // Reduzido (de 25)
            'scaling' => 1.2
        ],
        'mina_metal' => [
            'name' => 'Mina de Metal',
            'cost' => ['suprimentos' => 300, 'combustivel' => 100, 'pessoal' => 10],
            'time_base' => 12, // Reduzido (de 25)
            'scaling' => 1.3
        ],
        'central_energia' => [
            'name' => 'Central de Energia Solar',
            'cost' => ['suprimentos' => 200, 'pessoal' => 5],
            'time_base' => 10, // Reduzido (de 20)
            'scaling' => 1.1
        ],
        'housing' => [
            'name' => 'Complexo Residencial',
            'cost' => ['suprimentos' => 150, 'pessoal' => 0],
            'time_base' => 7, // Reduzido (de 15)
            'scaling' => 1.1
        ],
        'posto_recrutamento' => [
            'name' => 'Posto de Recrutamento',
            'cost' => ['suprimentos' => 400, 'combustivel' => 50, 'municoes' => 50, 'pessoal' => 5],
            'time_base' => 20, // Reduzido (de 40)
            'scaling' => 1.4
        ],
        'quartel' => [
            'name' => 'Quartel Regional',
            'cost' => ['suprimentos' => 600, 'combustivel' => 200, 'municoes' => 200, 'pessoal' => 20],
            'time_base' => 30, // Reduzido (de 60)
            'scaling' => 1.6
        ],
        'aerodromo' => [
            'name' => 'Aeródromo Militar',
            'cost' => ['suprimentos' => 1000, 'combustivel' => 800, 'municoes' => 500, 'pessoal' => 30],
            'time_base' => 60, // Reduzido (de 120)
            'scaling' => 1.8
        ],
        'radar_estrategico' => [
            'name' => 'Radar de Longo Alcance',
            'cost' => ['suprimentos' => 1500, 'combustivel' => 1200, 'municoes' => 300, 'pessoal' => 15],
            'time_base' => 90, // Reduzido (de 180)
            'scaling' => 1.7
        ],
        'centro_pesquisa' => [
            'name' => 'Centro de Pesquisa & I&D',
            'cost' => ['suprimentos' => 2000, 'combustivel' => 1000, 'municoes' => 1000, 'pessoal' => 40],
            'time_base' => 120, // Reduzido (de 240)
            'scaling' => 1.9
        ],
        'parlamento' => [
            'name' => 'Parlamento & Diplomacia',
            'cost' => ['suprimentos' => 3000, 'metal' => 2000, 'pessoal' => 10, 'energia' => 500],
            'time_base' => 150, // Reduzido (de 300)
            'scaling' => 2.5
        ],
    ],

    /**
     * Catálogo de Unidades (Tempos de Recrutamento)
     */
    'units' => [
        'infantaria' => [
            'name' => 'Infantaria de Elite',
            'time' => 5, // 5 segundos base (Reduzido de 10)
        ],
        'veiculo_leve_apc' => [
            'name' => 'Veículo Leve APC',
            'time' => 10, // Reduzido de 20
        ],
        'tanque_combate_mbt' => [
            'name' => 'Tanque de Combate MBT',
            'time' => 20, // Reduzido de 45
        ],
        'politico' => [
            'name' => 'Líder Político',
            'time' => 150, // Reduzido de 300
        ],
        'agente_espiao' => [
            'name' => 'Agente de Inteligência (Espião)',
            'time' => 30, // Reduzido de 60
        ],
        'helicoptero_ataque' => [
            'name' => 'Helicóptero de Ataque',
            'time' => 45, // Reduzido de 90
        ],
        'drone_reconhecimento' => [
            'name' => 'Drone de Reconhecimento',
            'time' => 15, // Reduzido de 30
        ],
        'artilharia_pesada' => [
            'name' => 'Artilharia Pesada',
            'time' => 60, // Reduzido de 120
        ],
        'engenheiro' => [
            'name' => 'Engenheiro Militar',
            'time' => 8, // Reduzido de 15
        ],
        'sniper' => [
            'name' => 'Atirador Especial (Sniper)',
            'time' => 12, // Reduzido de 25
        ],
    ]
];
