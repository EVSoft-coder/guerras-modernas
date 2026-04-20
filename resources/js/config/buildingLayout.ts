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
 * FASE 8 — RE-CALIBRAÇÃO VISUAL V65
 * Ajustado para coincidir com os pads "baked" na imagem de terreno.
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 380 }, // Descido de 300 para 380
    RADAR:     { x: 230, y: 160 }, // Ajustado X e Y
    ENERGY:    { x: 405, y: 140 }, // Ajustado Y
    RESEARCH:  { x: 580, y: 160 }, // Ajustado X e Y
    FACTORY:   { x: 190, y: 380 }, // Alinhado com HQ em Y
    BARRACKS:  { x: 610, y: 380 }, // Alinhado com HQ em Y
    AIRPORT:   { x: 400, y: 550 }, // Descido para a base
    WALL:      { x: 400, y: 640 }, // Fora do canvas ou base extrema
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
