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
 * FASE 15 — OPERAÇÃO UNIFICAÇÃO V79
 * Fusão de Telemetria V77 (Radar OK) com Equador V78 (HQ OK).
 * Ajuste de latitude Norte/Sul para eliminar flutuação.
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 350 }, // OK
    RADAR:     { x: 265, y: 170 }, // Recuperado V77 (User: Correct)
    ENERGY:    { x: 400, y: 45  }, // Norte Extremo
    RESEARCH:  { x: 535, y: 170 }, // Simetria V77
    FACTORY:   { x: 130, y: 350 }, // OK
    BARRACKS:  { x: 670, y: 350 }, // OK
    AIRPORT:   { x: 400, y: 420 }, // Ajuste Fino Sul
    WALL:      { x: 400, y: 550 }, // Ajuste Fino Sul (Muralha)
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
