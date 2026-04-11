/**
 * src/game/config/buildingEffects.ts
 * Configuração de efeitos e produção por tipo de edifício.
 */

export interface BuildingEffect {
    resource: 'wood' | 'stone' | 'iron' | 'all';
    baseProduction: number;
}

export const buildingEffects: Record<string, BuildingEffect> = {
    MINE: { resource: 'iron', baseProduction: 1 },
    QUARRY: { resource: 'stone', baseProduction: 1 },
    SAWMILL: { resource: 'wood', baseProduction: 1 },
    HQ: { resource: 'all', baseProduction: 1 }
};
