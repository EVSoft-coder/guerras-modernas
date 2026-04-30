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
        'base_speed' => 3.0,
        'min_travel_time' => 10,
    ],

    /**
     * Balanço Global (Engenharia e Economia)
     */
    'time_multiplier' => 1.05,        // Fator de tempo exponencial
    'hq_reduction_per_level' => 0.08,  // 8% de redução por nível de QG (Equilíbrio TribalModerno)
    'storage_base' => 1200,
    'storage_factor' => 1.25,
    'units_cost_increase_per_level' => 0.03,
    'units_time_reduction_per_level' => 0.08,

    /**
     * Produção de Recursos (Fator 1.2 para sustentabilidade)
     */
    'production' => [
        'mina_suprimentos' => ['resource' => 'suprimentos', 'base' => 480, 'factor' => 1.2], 
        'refinaria'        => ['resource' => 'combustivel', 'base' => 400, 'factor' => 1.2], 
        'fabrica_municoes' => ['resource' => 'municoes', 'base' => 360, 'factor' => 1.2], 
        'mina_metal'       => ['resource' => 'metal', 'base' => 440, 'factor' => 1.2], 
        'central_energia'  => ['resource' => 'energia', 'base' => 600, 'factor' => 1.2], 
        'housing'          => ['resource' => 'pessoal', 'base' => 100, 'factor' => 1.15],
    ],

    /**
     * Balanço de Edifícios (Regras de Economia e Engenharia)
     */
    'buildings' => [
        'hq' => [
            'name' => 'Centro de Comando (HQ)',
            'cost' => ['suprimentos' => 500, 'combustivel' => 200, 'metal' => 100, 'pessoal' => 20],
            'time_base' => 15,
            'scaling' => 1.45,
            'description' => 'Centro nevrálgico de comando e controlo. Níveis superiores otimizam as equipas de construção.'
        ],
        'muralha' => [
            'name' => 'Perímetro Defensivo (Muralha)',
            'cost' => ['suprimentos' => 400, 'municoes' => 200, 'metal' => 300, 'pessoal' => 5],
            'time_base' => 20,
            'scaling' => 1.3,
            'description' => 'Sistema de barreiras físicas e eletrónicas.',
            'requires' => ['hq' => 1]
        ],
        'mina_suprimentos' => [
            'name' => 'Complexo de Logística (Mina)',
            'cost' => ['suprimentos' => 200, 'combustivel' => 50, 'metal' => 50, 'pessoal' => 10],
            'time_base' => 7,
            'scaling' => 1.25,
            'description' => 'Instalação dedicada à extração e processamento de mantimentos vitais.'
        ],
        'refinaria' => [
            'name' => 'Refinaria de Combustível',
            'cost' => ['suprimentos' => 300, 'municoes' => 100, 'metal' => 150, 'pessoal' => 15],
            'time_base' => 10,
            'scaling' => 1.25,
            'description' => 'Processa crude e gases químicos.'
        ],
        'fabrica_municoes' => [
            'name' => 'Complexo Industrial de Armas',
            'cost' => ['suprimentos' => 250, 'combustivel' => 100, 'metal' => 200, 'pessoal' => 12],
            'time_base' => 12,
            'scaling' => 1.25,
            'description' => 'Linha de produção automatizada de munições.'
        ],
        'mina_metal' => [
            'name' => 'Centro de Extração de Metais',
            'cost' => ['suprimentos' => 300, 'combustivel' => 100, 'metal' => 100, 'pessoal' => 10],
            'time_base' => 12,
            'scaling' => 1.25,
            'description' => 'Extrai minérios de alta densidade.'
        ],
        'central_energia' => [
            'name' => 'Rede Elétrica e Fusão Solar',
            'cost' => ['suprimentos' => 200, 'metal' => 150, 'pessoal' => 5],
            'time_base' => 10,
            'scaling' => 1.2,
            'description' => 'Garante a estabilidade energética.'
        ],
        'housing' => [
            'name' => 'Complexo Habitacional',
            'cost' => ['suprimentos' => 150, 'metal' => 50, 'pessoal' => 0],
            'time_base' => 7,
            'scaling' => 1.15,
            'description' => 'Setores residenciais.'
        ],
        'posto_recrutamento' => [
            'name' => 'Centro de Mobilização Civil',
            'cost' => ['suprimentos' => 400, 'combustivel' => 50, 'metal' => 200, 'pessoal' => 5],
            'time_base' => 20,
            'scaling' => 1.35,
            'description' => 'Coordena o recrutamento.',
            'requires' => ['hq' => 1]
        ],
        'quartel' => [
            'name' => 'Comando de Operações Terrestres',
            'cost' => ['suprimentos' => 600, 'combustivel' => 200, 'municoes' => 200, 'metal' => 400, 'pessoal' => 20],
            'time_base' => 30,
            'scaling' => 1.4,
            'description' => 'O núcleo da força militar terrestre.',
            'requires' => ['hq' => 3]
        ],
        'aerodromo' => [
            'name' => 'Base Aérea Tática',
            'cost' => ['suprimentos' => 1000, 'combustivel' => 800, 'municoes' => 500, 'metal' => 1200, 'pessoal' => 30],
            'time_base' => 60,
            'scaling' => 1.55,
            'description' => 'Hangar para helicópteros.',
            'requires' => ['hq' => 15, 'quartel' => 10]
        ],
        'radar_estrategico' => [
            'name' => 'Centro de Inteligência e Radar',
            'cost' => ['suprimentos' => 1500, 'combustivel' => 1200, 'municoes' => 300, 'metal' => 800, 'pessoal' => 15],
            'time_base' => 90,
            'scaling' => 1.45,
            'description' => 'Deteção de ameaças.',
            'requires' => ['hq' => 5]
        ],
        'centro_pesquisa' => [
            'name' => 'Laboratórios de I&D Militar',
            'cost' => ['suprimentos' => 2000, 'combustivel' => 1000, 'municoes' => 1000, 'metal' => 2500, 'pessoal' => 40],
            'time_base' => 120,
            'scaling' => 1.5,
            'description' => 'Investigação científica.',
            'requires' => ['hq' => 5]
        ],
        'mercado' => [
            'name' => 'Hub de Comércio e Logística',
            'cost' => ['suprimentos' => 1000, 'combustivel' => 500, 'metal' => 500, 'pessoal' => 5],
            'time_base' => 45,
            'scaling' => 1.4,
            'description' => 'Troca de recursos.',
            'requires' => ['hq' => 10]
        ],
        'armazem' => [
            'name' => 'Depósito de Recursos (Armazém)',
            'cost' => ['suprimentos' => 200, 'combustivel' => 100, 'metal' => 200, 'pessoal' => 5],
            'time_base' => 10,
            'scaling' => 1.25,
            'description' => 'Aumenta capacidade de armazenamento.',
        ],
    ],

    /**
     * Catálogo de Unidades
     */
    'units' => [
        'infantaria' => ['name' => 'Infantaria de Elite', 'time' => 15],
        'veiculo_leve_apc' => ['name' => 'Veículo Leve APC', 'time' => 45],
        'tanque_combate_mbt' => ['name' => 'Tanque de Combate MBT', 'time' => 120],
        'politico' => ['name' => 'Líder Político', 'time' => 3600, 'requires' => ['hq' => 20]],
        'agente_espiao' => ['name' => 'Espião', 'time' => 180],
        'helicoptero_ataque' => ['name' => 'Helicóptero', 'time' => 300],
        'drone_reconhecimento' => ['name' => 'Drone', 'time' => 60],
        'artilharia_pesada' => ['name' => 'Artilharia', 'time' => 450],
        'engenheiro' => ['name' => 'Engenheiro', 'time' => 45],
        'sniper' => ['name' => 'Sniper', 'time' => 90],
    ]
];
