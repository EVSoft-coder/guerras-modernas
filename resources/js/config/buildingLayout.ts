export interface BuildingLayout {
    x: number;
    y: number;
    w: number;
    h: number;
    anchor: 'center' | 'bottom';
    assetName: string;
}

export const REFERENCE_WIDTH = 800;
export const REFERENCE_HEIGHT = 600;

/**
 * FASE 8 — CALIBRAÇÃO FINAL V70
 * Ascensão de grelha (-50px offset Y universal).
 * Alinhamento milimétrico com o centro dos pads baked.
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 300 }, // Subindo para 300
    RADAR:     { x: 200, y: 100 }, // Subindo para 100
    ENERGY:    { x: 400, y: 80  }, // Subindo para 80
    RESEARCH:  { x: 600, y: 100 }, // Subindo para 100
    FACTORY:   { x: 150, y: 300 }, // Alinhado com HQ a 300
    BARRACKS:  { x: 650, y: 300 }, // Alinhado com HQ a 300
    AIRPORT:   { x: 400, y: 480 }, // Subindo para 480
    WALL:      { x: 400, y: 560 }, // Perímetro base
};

export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    qg:                 { ...BUILDING_SLOTS.HQ, w: 220, h: 260, anchor: 'center', assetName: 'qg.png' },
    radar_estrategico:  { ...BUILDING_SLOTS.RADAR, w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { ...BUILDING_SLOTS.ENERGY, w: 140, h: 140, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { ...BUILDING_SLOTS.RESEARCH, w: 140, h: 140, anchor: 'center', assetName: 'centro_pesquisa.png' },
    fabrica_municoes:   { ...BUILDING_SLOTS.FACTORY, w: 180, h: 180, anchor: 'center', assetName: 'fabrica_municoes.png' },
    quartel:            { ...BUILDING_SLOTS.BARRACKS, w: 180, h: 180, anchor: 'center', assetName: 'quartel.png' },
    aerodromo:          { ...BUILDING_SLOTS.AIRPORT, w: 200, h: 200, anchor: 'center', assetName: 'aerodromo.png' },
    muralha:            { ...BUILDING_SLOTS.WALL, w: 280, h: 100, anchor: 'center', assetName: 'muralha.png' },
};
