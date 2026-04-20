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
 * FASE 10 — HARMONIA ISOMÉTRICA V74
 * Redução radical de escala (Aprox. 40%) para evitar overlapping e oclusão.
 * Coordenadas mantidas conforme Reconhecimento V73 (Precisão Gold).
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 260 }, 
    RADAR:     { x: 120, y: 110 },
    ENERGY:    { x: 400, y: 35  }, 
    RESEARCH:  { x: 680, y: 110 }, 
    FACTORY:   { x: 110, y: 245 }, 
    BARRACKS:  { x: 690, y: 245 }, 
    AIRPORT:   { x: 400, y: 430 }, // Ajuste fino -5px
    WALL:      { x: 400, y: 530 }, // Ajuste fino +10px
};

export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    qg:                 { ...BUILDING_SLOTS.HQ, w: 140, h: 160, anchor: 'center', assetName: 'hq_v2.png' },
    radar_estrategico:  { ...BUILDING_SLOTS.RADAR, w: 80, h: 90, anchor: 'center', assetName: 'radar_v1.png' },
    central_energia:    { ...BUILDING_SLOTS.ENERGY, w: 90, h: 90, anchor: 'center', assetName: 'energia_v1.png' },
    centro_pesquisa:    { ...BUILDING_SLOTS.RESEARCH, w: 90, h: 90, anchor: 'center', assetName: 'pesquisa_v1.png' },
    fabrica_municoes:   { ...BUILDING_SLOTS.FACTORY, w: 100, h: 110, anchor: 'center', assetName: 'fabrica_v2.png' },
    quartel:            { ...BUILDING_SLOTS.BARRACKS, w: 100, h: 110, anchor: 'center', assetName: 'quartel_v2.png' },

    aerodromo:          { ...BUILDING_SLOTS.AIRPORT, w: 140, h: 120, anchor: 'center', assetName: 'aerodromo_v1.png' },
    muralha:            { ...BUILDING_SLOTS.WALL, w: 200, h: 80, anchor: 'center', assetName: 'muralha_v1.png' },
};
