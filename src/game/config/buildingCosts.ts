/**
 * src/game/config/buildingCosts.ts
 * Tabela de Custos de ConstruÃ§Ã£o e Upgrade.
 */

export interface Cost {
    wood: number;
    stone: number;
    iron: number;
}

export const buildingCosts: Record<string, Cost> = {
    HQ: {
        wood: 100,
        stone: 100,
        iron: 100
    },
    MINE: {
        wood: 50,
        stone: 30,
        iron: 20
    },
    BARRACKS: {
        wood: 80,
        stone: 40,
        iron: 30
    },
    FACTORY: {
        wood: 120,
        stone: 80,
        iron: 60
    }
};
