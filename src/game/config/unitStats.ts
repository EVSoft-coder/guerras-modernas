/**
 * src/game/config/unitStats.ts
 * Estatísticas táticas das unidades para o motor de jogo.
 */
export const unitStats: Record<string, { speed: number, name: string, attack: number, defense: number, capacity: number }> = {
    'infantaria': { name: 'Infantaria de Assalto', speed: 10, attack: 10, defense: 15, capacity: 20 },
    'blindado_apc': { name: 'Transporte APC', speed: 25, attack: 20, defense: 40, capacity: 100 },
    'tanque_combate': { name: 'Tanque de Combate (MBT)', speed: 20, attack: 150, defense: 100, capacity: 50 },
    'helicoptero_ataque': { name: 'Helicóptero Apache', speed: 60, attack: 300, defense: 50, capacity: 0 },
    'agente_espiao': { name: 'Agente de Inteligência', speed: 80, attack: 0, defense: 1, capacity: 0 },
    'drone_recon': { name: 'Drone de Reconhecimento', speed: 120, attack: 0, defense: 5, capacity: 0 }
};
