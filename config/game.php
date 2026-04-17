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
    'buildings' => [
        // Mantido para compatibilidade com lógica de custos se necessário
    ]
];
