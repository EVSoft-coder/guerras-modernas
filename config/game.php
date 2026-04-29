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
            'time_base' => 15,
            'scaling' => 1.5,
            'description' => 'Centro nevrálgico de comando e controlo. Coordena todas as operações de engenharia e logística da base. Níveis superiores otimizam as equipas de construção, reduzindo drasticamente o tempo de conclusão de outros edifícios.'
        ],
        'muralha' => [
            'name' => 'Perímetro Defensivo (Muralha)',
            'cost' => ['suprimentos' => 400, 'municoes' => 200, 'pessoal' => 5],
            'time_base' => 20,
            'scaling' => 1.3,
            'description' => 'Sistema de barreiras físicas e eletrónicas de última geração. Além da proteção física, fornece bónus táticos de visibilidade e cobertura, aumentando exponencialmente a eficácia defensiva da guarnição estacionada.'
        ],
        'mina_suprimentos' => [
            'name' => 'Complexo de Logística (Mina)',
            'cost' => ['suprimentos' => 200, 'combustivel' => 50, 'pessoal' => 10],
            'time_base' => 7,
            'scaling' => 1.2,
            'description' => 'Instalação dedicada à extração e processamento de mantimentos vitais. O coração da sustentabilidade da base, garantindo que o fluxo de suprimentos nunca pare.'
        ],
        'refinaria' => [
            'name' => 'Refinaria de Combustível',
            'cost' => ['suprimentos' => 300, 'municoes' => 100, 'pessoal' => 15],
            'time_base' => 10,
            'scaling' => 1.2,
            'description' => 'Processa crude e gases químicos para alimentar a frota mecanizada e os geradores da base. Essencial para qualquer operação ofensiva de larga escala.'
        ],
        'fabrica_municoes' => [
            'name' => 'Complexo Industrial de Armas',
            'cost' => ['suprimentos' => 250, 'combustivel' => 100, 'pessoal' => 12],
            'time_base' => 12,
            'scaling' => 1.2,
            'description' => 'Linha de produção automatizada de munições e explosivos. Níveis elevados permitem o abastecimento constante de unidades de artilharia e defesa antiaérea.'
        ],
        'mina_metal' => [
            'name' => 'Centro de Extração de Metais',
            'cost' => ['suprimentos' => 300, 'combustivel' => 100, 'pessoal' => 10],
            'time_base' => 12,
            'scaling' => 1.3,
            'description' => 'Extrai minérios de alta densidade necessários para a blindagem de veículos e reforço de estruturas táticas.'
        ],
        'central_energia' => [
            'name' => 'Rede Elétrica e Fusão Solar',
            'cost' => ['suprimentos' => 200, 'pessoal' => 5],
            'time_base' => 10,
            'scaling' => 1.1,
            'description' => 'Garante a estabilidade energética de toda a base. Sem energia, as produções automatizadas e os sistemas de radar sofrem penalizações severas.'
        ],
        'housing' => [
            'name' => 'Complexo Habitacional',
            'cost' => ['suprimentos' => 150, 'pessoal' => 0],
            'time_base' => 7,
            'scaling' => 1.1,
            'description' => 'Setores residenciais para o pessoal militar e civil. Determina o limite máximo de população que a base pode sustentar.'
        ],
        'posto_recrutamento' => [
            'name' => 'Centro de Mobilização Civil',
            'cost' => ['suprimentos' => 400, 'combustivel' => 50, 'municoes' => 50, 'pessoal' => 5],
            'time_base' => 20,
            'scaling' => 1.4,
            'description' => 'Coordena o recrutamento e treino básico de novos recrutas. Níveis superiores aumentam o fluxo de pessoal disponível para treinamento militar.'
        ],
        'quartel' => [
            'name' => 'Comando de Operações Terrestres',
            'cost' => ['suprimentos' => 600, 'combustivel' => 200, 'municoes' => 200, 'pessoal' => 20],
            'time_base' => 30,
            'scaling' => 1.6,
            'description' => 'O núcleo da força militar terrestre. Permite o treino de infantaria especializada, veículos APC e os poderosos tanques de combate MBT.'
        ],
        'aerodromo' => [
            'name' => 'Base Aérea Tática',
            'cost' => ['suprimentos' => 1000, 'combustivel' => 800, 'municoes' => 500, 'pessoal' => 30],
            'time_base' => 60,
            'scaling' => 1.8,
            'description' => 'Hangar e pista de descolagem para helicópteros de ataque e unidades de suporte aéreo. Fundamental para garantir a supremacia do espaço aéreo regional.'
        ],
        'radar_estrategico' => [
            'name' => 'Centro de Inteligência e Radar',
            'cost' => ['suprimentos' => 1500, 'combustivel' => 1200, 'municoes' => 300, 'pessoal' => 15],
            'time_base' => 90,
            'scaling' => 1.7,
            'description' => 'Ouve as transmissões inimigas e varre o horizonte em busca de ameaças. Essencial para operações de espionagem e deteção antecipada de exércitos em movimento.'
        ],
        'centro_pesquisa' => [
            'name' => 'Laboratórios de I&D Militar',
            'cost' => ['suprimentos' => 2000, 'combustivel' => 1000, 'municoes' => 1000, 'pessoal' => 40],
            'time_base' => 120,
            'scaling' => 1.9,
            'description' => 'Onde o futuro da guerra é desenhado. Desbloqueia novas tecnologias, unidades avançadas e bónus de produção através de investigação científica.'
        ],
        'academia_militar' => [
            'name' => 'Academia Militar',
            'cost' => ['suprimentos' => 3000, 'metal' => 2000, 'pessoal' => 10, 'energia' => 500],
            'time_base' => 150,
            'scaling' => 2.5,
            'description' => 'Centro de formação estratégica de alto nível. Essencial para a cunhagem de moedas e para desbloquear o treino de Líderes Políticos no Centro de Comando.'
        ],
        'mercado' => [
            'name' => 'Hub de Comércio e Logística',
            'cost' => ['suprimentos' => 1000, 'combustivel' => 500, 'metal' => 200, 'pessoal' => 5],
            'time_base' => 45,
            'scaling' => 1.5,
            'description' => 'Facilita a troca de recursos entre bases aliadas e permite o acesso ao mercado global para conversão de excedentes.'
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
            'name' => 'Líder Político (Nobre)',
            'time' => 150, 
            'requires' => ['academia_militar' => 1, 'hq' => 20],
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
