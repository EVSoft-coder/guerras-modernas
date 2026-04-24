<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Árvore Tecnológica — Guerras Modernas
    |--------------------------------------------------------------------------
    | Cada tecnologia tem custo base, tempo, nível máximo e efeito no jogo.
    | Custo escala com: cost_base * (1 + level * 1.2)
    | Tempo escala com: time_base * (1 + level * 0.5)
    */

    'balistica_avancada' => [
        'name' => 'Balística Avançada',
        'description' => '+2% de poder de ataque por nível para todas as unidades.',
        'effect' => 'attack_bonus',
        'bonus_per_level' => 0.02,
        'max_level' => 20,
        'cost' => ['suprimentos' => 800, 'municoes' => 600, 'metal' => 400],
        'time_base' => 600,
        'requires_building' => 'centro_pesquisa',
        'requires_level' => 1,
        'icon' => 'crosshair',
    ],

    'blindagem_reativa' => [
        'name' => 'Blindagem Reativa',
        'description' => '+2% de poder de defesa por nível para todas as unidades.',
        'effect' => 'defense_bonus',
        'bonus_per_level' => 0.02,
        'max_level' => 20,
        'cost' => ['suprimentos' => 700, 'metal' => 800, 'energia' => 300],
        'time_base' => 600,
        'requires_building' => 'centro_pesquisa',
        'requires_level' => 1,
        'icon' => 'shield',
    ],

    'logistica_militar' => [
        'name' => 'Logística Militar',
        'description' => '+5% de velocidade de marcha por nível.',
        'effect' => 'speed_bonus',
        'bonus_per_level' => 0.05,
        'max_level' => 10,
        'cost' => ['suprimentos' => 500, 'combustivel' => 400, 'energia' => 200],
        'time_base' => 480,
        'requires_building' => 'centro_pesquisa',
        'requires_level' => 2,
        'icon' => 'truck',
    ],

    'eficiencia_energetica' => [
        'name' => 'Eficiência Energética',
        'description' => '+3% de produção de energia por nível.',
        'effect' => 'production_bonus_energia',
        'bonus_per_level' => 0.03,
        'max_level' => 15,
        'cost' => ['suprimentos' => 400, 'energia' => 500],
        'time_base' => 300,
        'requires_building' => 'centro_pesquisa',
        'requires_level' => 1,
        'icon' => 'zap',
    ],

    'mineracao_profunda' => [
        'name' => 'Mineração Profunda',
        'description' => '+3% de produção de metal por nível.',
        'effect' => 'production_bonus_metal',
        'bonus_per_level' => 0.03,
        'max_level' => 15,
        'cost' => ['suprimentos' => 500, 'metal' => 300, 'combustivel' => 200],
        'time_base' => 300,
        'requires_building' => 'centro_pesquisa',
        'requires_level' => 1,
        'icon' => 'pickaxe',
    ],

    'capacidade_armazem' => [
        'name' => 'Capacidade de Armazém',
        'description' => '+10% de capacidade de armazenamento por nível.',
        'effect' => 'storage_bonus',
        'bonus_per_level' => 0.10,
        'max_level' => 20,
        'cost' => ['suprimentos' => 600, 'metal' => 400],
        'time_base' => 240,
        'requires_building' => 'centro_pesquisa',
        'requires_level' => 1,
        'icon' => 'warehouse',
    ],

    'espionagem_avancada' => [
        'name' => 'Espionagem Avançada',
        'description' => 'Desbloqueia o uso de agentes espiões e drones de reconhecimento.',
        'effect' => 'unlock_espionagem',
        'bonus_per_level' => 0,
        'max_level' => 1,
        'cost' => ['suprimentos' => 2000, 'combustivel' => 1500, 'energia' => 1000],
        'time_base' => 1800,
        'requires_building' => 'radar_estrategico',
        'requires_level' => 1,
        'icon' => 'eye',
    ],

    'guerra_aerea' => [
        'name' => 'Guerra Aérea',
        'description' => 'Desbloqueia helicópteros de ataque e operações aéreas.',
        'effect' => 'unlock_aerea',
        'bonus_per_level' => 0,
        'max_level' => 1,
        'cost' => ['suprimentos' => 3000, 'combustivel' => 2000, 'municoes' => 1500, 'energia' => 500],
        'time_base' => 2400,
        'requires_building' => 'aerodromo',
        'requires_level' => 1,
        'icon' => 'plane',
    ],
];
