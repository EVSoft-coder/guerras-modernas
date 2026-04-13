/**
 * src/game/config/buildings.ts
 * Registo Global de Infraestruturas e Edifícios do Império.
 */

export interface BuildingDefinition {
    type: string;
    name: string;
    baseLevel: number;
}

export const GLOBAL_BUILDINGS: BuildingDefinition[] = [
    { type: 'qg', name: 'Quartel General', baseLevel: 1 },
    { type: 'quartel', name: 'Campo de Treino / Quartel', baseLevel: 0 },
    { type: 'mina_suprimentos', name: 'Centro de Logística / Mantimentos', baseLevel: 0 },
    { type: 'refinaria', name: 'Refinaria de Combustível', baseLevel: 0 },
    { type: 'fabrica_municoes', name: 'Arsenal de Munições', baseLevel: 0 },
    { type: 'mina_metal', name: 'Complexo de Extração de Metal', baseLevel: 0 },
    { type: 'central_energia', name: 'Central de Fusão de Energia', baseLevel: 0 },
    { type: 'posto_recrutamento', name: 'Gabinete de Recrutamento', baseLevel: 0 },
    { type: 'aerodromo', name: 'Base Aérea / Heliponto', baseLevel: 0 },
    { type: 'radar_estrategico', name: 'Radar de Varredura Estratégico', baseLevel: 0 },
    { type: 'centro_pesquisa', name: 'Laboratório de I&D', baseLevel: 0 },
    { type: 'muralha', name: 'Perímetro Defensivo', baseLevel: 0 },
    { type: 'parlamento', name: 'Parlamento / Centro de Soberania', baseLevel: 0 },
    { type: 'factory', name: 'Fábrica Metalúrgica de Grande Porte', baseLevel: 0 },
    { type: 'solar', name: 'Planta de Energia Solar Térmica', baseLevel: 0 }
];
