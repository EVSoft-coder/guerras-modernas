/**
 * src/game/config/unitStats.ts
 * Estatísticas táticas das unidades para o motor de jogo.
 */
export const unitStats: Record<string, { speed: number, name: string }> = {
    'infantaria': { name: 'Infantaria de Assalto', speed: 10 },
    'blindado_apc': { name: 'Transporte APC', speed: 25 },
    'tanque_combate': { name: 'Tanque de Combate (MBT)', speed: 20 },
    'helicoptero_ataque': { name: 'Helicóptero Apache', speed: 60 },
    'agente_espiao': { name: 'Agente de Inteligência', speed: 80 },
    'drone_recon': { name: 'Drone de Reconhecimento', speed: 120 }
};
