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
 * FASE 8 — CALIBRAÇÃO DOURADA V68
 * Alinhamento final baseado na zona de equilíbrio 400.
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 400 }, // O Ponto de Equilíbrio
    RADAR:     { x: 230, y: 140 }, // Subindo o topo
    ENERGY:    { x: 405, y: 120 }, // Subindo o topo
    RESEARCH:  { x: 580, y: 140 }, // Subindo o topo
    FACTORY:   { x: 190, y: 400 }, // Alinhado com HQ
    BARRACKS:  { x: 610, y: 400 }, // Alinhado com HQ
    AIRPORT:   { x: 400, y: 520 }, // Fila Base
    WALL:      { x: 400, y: 580 }, // Perímetro
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
