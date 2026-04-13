/**
 * src/game/config/buildingConfigs.ts
 */

export interface ResourceCost {
    suprimentos?: number;
    combustivel?: number;
    municoes?: number;
    metal?: number;
    energia?: number;
    pessoal?: number;
}

export interface BuildingDefinition {
    id: string;
    name: string;
    cost: ResourceCost;
    timeBase: number;
    requires?: Record<string, number>;
}

export const buildingConfigs: Record<string, BuildingDefinition> = {
    qg: {
        id: 'qg',
        name: 'Centro de Comando (QG)',
        cost: { suprimentos: 500, combustivel: 200, pessoal: 20 },
        timeBase: 120,
    },
    muralha: {
        id: 'muralha',
        name: 'Perímetro Defensivo (Muralha)',
        cost: { suprimentos: 400, municoes: 200, pessoal: 5 },
        timeBase: 180,
    },
    mina_suprimentos: {
        id: 'mina_suprimentos',
        name: 'Mina de Suprimentos',
        cost: { suprimentos: 200, combustivel: 50, pessoal: 10 },
        timeBase: 60,
    },
    refinaria: {
        id: 'refinaria',
        name: 'Refinaria de Combustível',
        cost: { suprimentos: 300, municoes: 100, pessoal: 15 },
        timeBase: 90,
    },
    fabrica_municoes: {
        id: 'fabrica_municoes',
        name: 'Fábrica de Munições',
        cost: { suprimentos: 250, combustivel: 100, pessoal: 12 },
        timeBase: 120,
    },
    posto_recrutamento: {
        id: 'posto_recrutamento',
        name: 'Posto de Recrutamento',
        cost: { suprimentos: 400, combustivel: 50, municoes: 50, pessoal: 5 },
        timeBase: 150,
    },
    quartel: {
        id: 'quartel',
        name: 'Quartel Regional',
        cost: { suprimentos: 600, combustivel: 200, municoes: 200, pessoal: 20 },
        timeBase: 300,
    },
    aerodromo: {
        id: 'aerodromo',
        name: 'Aeródromo Militar',
        cost: { suprimentos: 1000, combustivel: 800, municoes: 500, pessoal: 30 },
        timeBase: 600,
    },
    radar_estrategico: {
        id: 'radar_estrategico',
        name: 'Radar de Longo Alcance',
        cost: { suprimentos: 1500, combustivel: 1200, municoes: 300, pessoal: 15 },
        timeBase: 900,
    },
    centro_pesquisa: {
        id: 'centro_pesquisa',
        name: 'Centro de Pesquisa & I&D',
        cost: { suprimentos: 2000, combustivel: 1000, municoes: 1000, pessoal: 40 },
        timeBase: 1200,
    },
    factory: {
        id: 'factory',
        name: 'Mina de Metal Industrial',
        cost: { suprimentos: 300, combustivel: 100, pessoal: 10 },
        timeBase: 120,
    },
    solar: {
        id: 'solar',
        name: 'Central de Energia Termoelétrica',
        cost: { suprimentos: 200, pessoal: 5 },
        timeBase: 90,
    },
    housing: {
        id: 'housing',
        name: 'Complexo Residencial (Habitação)',
        cost: { suprimentos: 150, pessoal: 0 },
        timeBase: 60,
    },
    parlamento: {
        id: 'parlamento',
        name: 'Parlamento & Diplomacia',
        cost: { suprimentos: 3000, metal: 2000, pessoal: 10, energia: 500 },
        timeBase: 1800,
        requires: { qg: 10 }
    },
};
