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
 * FASE 12 — CALIBRAÇÃO DE IMERSÃO V76
 * Aplicando Offset de Solo (+40px) para compensar a perspetiva 3D dos assets.
 * As etiquetas serão movidas para o topo do componente no BuildingNode.
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 350 }, // Antes 310
    RADAR:     { x: 265, y: 220 }, // Antes 180
    ENERGY:    { x: 400, y: 90  }, // Antes 50
    RESEARCH:  { x: 535, y: 220 }, // Antes 180
    FACTORY:   { x: 130, y: 350 }, // Antes 310
    BARRACKS:  { x: 670, y: 350 }, // Antes 310
    AIRPORT:   { x: 400, y: 480 }, // Antes 440
    WALL:      { x: 400, y: 585 }, // Limite do Canvas (Antes 570)
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
