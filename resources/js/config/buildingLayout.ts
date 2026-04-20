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
 * FASE 13 — CALIBRAÇÃO FINAL V77
 * Sincronia de Latitude Baseada em Feedback Visual (Vila Híbrida).
 * Linha Central (Y=350) confirmada como Correta. 
 * Polos Norte e Sul elevados para reconexão com os Pads.
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 350 }, // CONFIRMADO
    RADAR:     { x: 265, y: 170 }, // ELEVADO (-50px)
    ENERGY:    { x: 400, y: 60  }, // ELEVADO (-30px)
    RESEARCH:  { x: 535, y: 170 }, // ELEVADO (-50px)
    FACTORY:   { x: 130, y: 350 }, // CONFIRMADO
    BARRACKS:  { x: 670, y: 350 }, // CONFIRMADO
    AIRPORT:   { x: 400, y: 440 }, // ELEVADO (-40px)
    WALL:      { x: 400, y: 570 }, // ELEVADO (-15px)
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
