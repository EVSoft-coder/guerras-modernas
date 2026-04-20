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
 * FASE 8 — ULTRA-CALIBRAÇÃO V66
 * Afundando a grelha para latitudes profundas (+80px offset geral).
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 480 }, // Afundado para 480
    RADAR:     { x: 230, y: 220 }, // Afundado para 220
    ENERGY:    { x: 405, y: 200 }, // Afundado para 200
    RESEARCH:  { x: 580, y: 220 }, // Afundado para 220
    FACTORY:   { x: 170, y: 480 }, // Alinhado com HQ
    BARRACKS:  { x: 630, y: 480 }, // Alinhado com HQ
    AIRPORT:   { x: 400, y: 620 }, // Quase no rodapé
    WALL:      { x: 400, y: 700 }, // Fora do canvas (Perímetro exterior)
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
