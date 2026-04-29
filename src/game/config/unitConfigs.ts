/**
 * src/game/config/unitConfigs.ts
 */
import { ResourceCost } from './buildingConfigs';

export interface UnitDefinition {
    id: string;
    name: string;
    cost: ResourceCost;
    time: number;
    attack: number;
    defenseGeneral: number;
    defenseArmored: number;
    speed: number;
    capacity: number;
    isSpy?: boolean;
    isDrone?: boolean;
    canConquer?: boolean;
    requires?: Record<string, number>;
}

export const unitConfigs: Record<string, UnitDefinition> = {
    infantaria: {
        id: 'infantaria',
        name: 'Infantaria de Assalto',
        cost: { suprimentos: 100, municoes: 20, pessoal: 1 },
        time: 30,
        attack: 10,
        defenseGeneral: 15,
        defenseArmored: 5,
        speed: 10,
        capacity: 20,
    },
    blindado_apc: {
        id: 'blindado_apc',
        name: 'Transporte APC',
        cost: { suprimentos: 300, combustivel: 100, municoes: 50, pessoal: 2 },
        time: 120,
        attack: 20,
        defenseGeneral: 40,
        defenseArmored: 30,
        speed: 25,
        capacity: 100,
    },
    tanque_combate: {
        id: 'tanque_combate',
        name: 'Tanque de Combate (MBT)',
        cost: { suprimentos: 800, combustivel: 300, municoes: 200, pessoal: 4 },
        time: 600,
        attack: 150,
        defenseGeneral: 100,
        defenseArmored: 120,
        speed: 20,
        capacity: 50,
    },
    helicoptero_ataque: {
        id: 'helicoptero_ataque',
        name: 'Helicóptero Apache',
        cost: { suprimentos: 1500, combustivel: 800, municoes: 500, pessoal: 2 },
        time: 1800,
        attack: 300,
        defenseGeneral: 50,
        defenseArmored: 40,
        speed: 60,
        capacity: 0,
    },
    agente_espiao: {
        id: 'agente_espiao',
        name: 'Agente de Inteligência',
        cost: { suprimentos: 500, combustivel: 100, municoes: 50, pessoal: 1 },
        time: 600,
        attack: 0,
        defenseGeneral: 1,
        defenseArmored: 1,
        speed: 80,
        capacity: 0,
        isSpy: true,
    },
    drone_recon: {
        id: 'drone_recon',
        name: 'Drone de Reconhecimento',
        cost: { suprimentos: 400, combustivel: 200, pessoal: 1 },
        time: 300,
        attack: 0,
        defenseGeneral: 5,
        defenseArmored: 2,
        speed: 120,
        capacity: 0,
        isDrone: true,
    },
    politico: {
        id: 'politico',
        name: 'Líder Político',
        cost: { suprimentos: 40000, municoes: 50000, combustivel: 50000, pessoal: 100 },
        time: 3600,
        attack: 1,
        defenseGeneral: 2,
        defenseArmored: 0,
        speed: 8,
        capacity: 0,
        requires: { academia_militar: 1, qg: 20 },
        canConquer: true
    },
};
