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
 * FASE 9 — SINCRONIA MESTRA V73
 * Coordenadas extraídas via Browser Reconnaissance (100% Precisão Real).
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 260 }, // Centro Absoluto
    RADAR:     { x: 120, y: 110 }, // Topo Esquerdo
    ENERGY:    { x: 400, y: 35  }, // Topo Extremo
    RESEARCH:  { x: 680, y: 110 }, // Topo Direito
    FACTORY:   { x: 110, y: 245 }, // Meio Esquerdo
    BARRACKS:  { x: 690, y: 245 }, // Meio Direito
    AIRPORT:   { x: 400, y: 440 }, // Base Inferior
    WALL:      { x: 400, y: 520 }, // Perímetro
};

export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    qg:                 { ...BUILDING_SLOTS.HQ, w: 220, h: 260, anchor: 'center', assetName: 'hq_v1.png' },
    radar_estrategico:  { ...BUILDING_SLOTS.RADAR, w: 120, h: 120, anchor: 'center', assetName: 'radar_v1.png' },
    central_energia:    { ...BUILDING_SLOTS.ENERGY, w: 140, h: 140, anchor: 'center', assetName: 'energia_v1.png' },
    centro_pesquisa:    { ...BUILDING_SLOTS.RESEARCH, w: 140, h: 140, anchor: 'center', assetName: 'pesquisa_v1.png' },
    fabrica_municoes:   { ...BUILDING_SLOTS.FACTORY, w: 180, h: 180, anchor: 'center', assetName: 'fabrica_v1.png' },
    quartel:            { ...BUILDING_SLOTS.BARRACKS, w: 180, h: 180, anchor: 'center', assetName: 'quartel_v1.png' },
    aerodromo:          { ...BUILDING_SLOTS.AIRPORT, w: 200, h: 200, anchor: 'center', assetName: 'aerodromo_v1.png' },
    muralha:            { ...BUILDING_SLOTS.WALL, w: 280, h: 100, anchor: 'center', assetName: 'muralha_v1.png' },
};
