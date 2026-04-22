export interface BuildingLayout {
    id: string;
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
 * FASE 16 — MATRIX ISOMÉTRICA PERFEITA (V80)
 * Coordenadas matemáticas exatas dos centros dos pads no background.
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 300 }, 
    RADAR:     { x: 268, y: 185 }, 
    ENERGY:    { x: 400, y: 70  }, 
    RESEARCH:  { x: 532, y: 185 }, 
    FACTORY:   { x: 135, y: 300 }, 
    BARRACKS:  { x: 665, y: 300 }, 
    AIRPORT:   { x: 532, y: 415 }, 
    WALL:      { x: 400, y: 530 }, 
};

/**
 * BUILDING_OFFSETS V96 — CONSOLIDADO
 * Posições finais após calibração manual sobre Terreno V22.
 */
export const BUILDING_OFFSETS: Record<string, { x: number, y: number, rotation?: number }> = {
    HQ:        { x: 1, y: 59 },
    RADAR:     { x: -75, y: 2 },
    ENERGY:    { x: 25, y: 135 },
    RESEARCH:  { x: 121, y: 22 },
    FACTORY:   { x: 28, y: 28 },
    BARRACKS:  { x: 6, y: 55 },
    AIRPORT:   { x: -10, y: 90 },
    WALL:      { x: -296, y: 8, rotation: 0 },
};

export const BUILDING_LAYOUT: Record<string, BuildingLayout & { id: string }> = {
    central_energia:    { ...BUILDING_SLOTS.ENERGY, id: 'ENERGY', w: 90, h: 90, anchor: 'center', assetName: 'energia_v1.png' },
    radar_estrategico:  { ...BUILDING_SLOTS.RADAR, id: 'RADAR', w: 80, h: 90, anchor: 'center', assetName: 'radar_v1.png' },
    centro_pesquisa:    { ...BUILDING_SLOTS.RESEARCH, id: 'RESEARCH', w: 90, h: 90, anchor: 'center', assetName: 'pesquisa_v1.png' },
    fabrica_municoes:   { ...BUILDING_SLOTS.FACTORY, id: 'FACTORY', w: 100, h: 110, anchor: 'center', assetName: 'fabrica_v2.png' },
    hq:                 { ...BUILDING_SLOTS.HQ, id: 'HQ', w: 140, h: 160, anchor: 'center', assetName: 'hq_v2.png' },
    quartel:            { ...BUILDING_SLOTS.BARRACKS, id: 'BARRACKS', w: 100, h: 110, anchor: 'center', assetName: 'quartel_v2.png' },
    aerodromo:          { ...BUILDING_SLOTS.AIRPORT, id: 'AIRPORT', w: 140, h: 120, anchor: 'center', assetName: 'aerodromo_v1.png' },
    muralha:            { ...BUILDING_SLOTS.WALL, id: 'WALL', w: 320, h: 200, anchor: 'center', assetName: 'muralha_v2.png' },
};
