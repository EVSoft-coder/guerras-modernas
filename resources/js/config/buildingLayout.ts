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
 * (Baseado em grelha isométrica de 132.5px X, 115px Y partindo de 400,300)
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 300 }, 
    RADAR:     { x: 268, y: 185 }, 
    ENERGY:    { x: 400, y: 70  }, 
    RESEARCH:  { x: 532, y: 185 }, 
    FACTORY:   { x: 135, y: 300 }, 
    BARRACKS:  { x: 665, y: 300 }, 
    AIRPORT:   { x: 532, y: 415 }, // PAD Sudeste p/ afastar do QG central
    WALL:      { x: 400, y: 530 }, 
};

export const BUILDING_OFFSETS: Record<string, { x: number, y: number }> = {
    HQ:        { x: 1, y: 59 },
    RADAR:     { x: -75, y: 2 },
    ENERGY:    { x: 25, y: 135 },
    RESEARCH:  { x: 121, y: 22 },
    FACTORY:   { x: 28, y: 28 },
    BARRACKS:  { x: 6, y: 55 },
    AIRPORT:   { x: -7, y: 89 },
    WALL:      { x: -244, y: -73 },
};

export const BUILDING_LAYOUT: Record<string, BuildingLayout & { id: string }> = {
    // LINHA 1 (Fundo)
    central_energia:    { ...BUILDING_SLOTS.ENERGY, id: 'ENERGY', w: 90, h: 90, anchor: 'center', assetName: 'energia_v1.png' },
    
    // LINHA 2
    radar_estrategico:  { ...BUILDING_SLOTS.RADAR, id: 'RADAR', w: 80, h: 90, anchor: 'center', assetName: 'radar_v1.png' },
    centro_pesquisa:    { ...BUILDING_SLOTS.RESEARCH, id: 'RESEARCH', w: 90, h: 90, anchor: 'center', assetName: 'pesquisa_v1.png' },
    
    // LINHA 3 (Equador)
    fabrica_municoes:   { ...BUILDING_SLOTS.FACTORY, id: 'FACTORY', w: 100, h: 110, anchor: 'center', assetName: 'fabrica_v2.png' },
    qg:                 { ...BUILDING_SLOTS.HQ, id: 'HQ', w: 140, h: 160, anchor: 'center', assetName: 'hq_v2.png' },
    quartel:            { ...BUILDING_SLOTS.BARRACKS, id: 'BARRACKS', w: 100, h: 110, anchor: 'center', assetName: 'quartel_v2.png' },
    
    // LINHA 4
    aerodromo:          { ...BUILDING_SLOTS.AIRPORT, id: 'AIRPORT', w: 140, h: 120, anchor: 'center', assetName: 'aerodromo_v1.png' },
    
    // LINHA 5 (Frente)
    muralha:            { ...BUILDING_SLOTS.WALL, id: 'WALL', w: 200, h: 80, anchor: 'center', assetName: 'muralha_v1.png' },
};
