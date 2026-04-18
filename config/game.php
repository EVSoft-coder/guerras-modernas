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
        'base_speed' => 1.0, // Unidades de distância por segundo (ajustável)
        'min_travel_time' => 60, // Mínimo de 60 segundos por viagem
    ],

    /**
     * Outras configurações do jogo (Fase Avançada)
     */
    /**
     * Balanço de Edifícios (Regras de Economia e Engenharia)
     */
    'buildings' => [
        'qg' => [
            'name' => 'Centro de Comando (QG)',
            'cost' => ['suprimentos' => 500, 'combustivel' => 200, 'pessoal' => 20],
            'time_base' => 120,
            'scaling' => 1.5
        ],
        'muralha' => [
            'name' => 'Perímetro Defensivo (Muralha)',
            'cost' => ['suprimentos' => 400, 'municoes' => 200, 'pessoal' => 5],
            'time_base' => 180,
            'scaling' => 1.3
        ],
        'mina_suprimentos' => [
            'name' => 'Mina de Suprimentos',
            'cost' => ['suprimentos' => 200, 'combustivel' => 50, 'pessoal' => 10],
            'time_base' => 60,
            'scaling' => 1.2
        ],
        'refinaria' => [
            'name' => 'Refinaria de Combustível',
            'cost' => ['suprimentos' => 300, 'municoes' => 100, 'pessoal' => 15],
            'time_base' => 90,
            'scaling' => 1.2
        ],
        'fabrica_municoes' => [
            'name' => 'Fábrica de Munições',
            'cost' => ['suprimentos' => 250, 'combustivel' => 100, 'pessoal' => 12],
            'time_base' => 120,
            'scaling' => 1.2
        ],
        'mina_metal' => [
            'name' => 'Mina de Metal',
            'cost' => ['suprimentos' => 300, 'combustivel' => 100, 'pessoal' => 10],
            'time_base' => 120,
            'scaling' => 1.3
        ],
        'central_energia' => [
            'name' => 'Central de Energia Solar',
            'cost' => ['suprimentos' => 200, 'pessoal' => 5],
            'time_base' => 90,
            'scaling' => 1.1
        ],
        'housing' => [
            'name' => 'Complexo Residencial',
            'cost' => ['suprimentos' => 150, 'pessoal' => 0],
            'time_base' => 60,
            'scaling' => 1.1
        ],
        'posto_recrutamento' => [
            'name' => 'Posto de Recrutamento',
            'cost' => ['suprimentos' => 400, 'combustivel' => 50, 'municoes' => 50, 'pessoal' => 5],
            'time_base' => 150,
            'scaling' => 1.4
        ],
        'quartel' => [
            'name' => 'Quartel Regional',
            'cost' => ['suprimentos' => 600, 'combustivel' => 200, 'municoes' => 200, 'pessoal' => 20],
            'time_base' => 300,
            'scaling' => 1.6
        ],
        'aerodromo' => [
            'name' => 'Aeródromo Militar',
            'cost' => ['suprimentos' => 1000, 'combustivel' => 800, 'municoes' => 500, 'pessoal' => 30],
            'time_base' => 600,
            'scaling' => 1.8
        ],
        'radar_estrategico' => [
            'name' => 'Radar de Longo Alcance',
            'cost' => ['suprimentos' => 1500, 'combustivel' => 1200, 'municoes' => 300, 'pessoal' => 15],
            'time_base' => 900,
            'scaling' => 1.7
        ],
        'centro_pesquisa' => [
            'name' => 'Centro de Pesquisa & I&D',
            'cost' => ['suprimentos' => 2000, 'combustivel' => 1000, 'municoes' => 1000, 'pessoal' => 40],
            'time_base' => 1200,
            'scaling' => 1.9
        ],
        'parlamento' => [
            'name' => 'Parlamento & Diplomacia',
            'cost' => ['suprimentos' => 3000, 'metal' => 2000, 'pessoal' => 10, 'energia' => 500],
            'time_base' => 1800,
            'scaling' => 2.5
        ],
    ]
];
