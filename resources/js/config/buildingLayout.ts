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
 * FASE 8 — EXPANÇÃO LATERAL V71
 * Ajuste de envergadura baseado na divergência isométrica.
 * HQ/Energia/Aeródromo bloqueados (sucesso V70).
 */
export const BUILDING_SLOTS = {
    HQ:        { x: 400, y: 300 }, // GOLD
    RADAR:     { x: 120, y: 130 }, // Expansão Lateral Topo
    ENERGY:    { x: 400, y: 80  }, // GOLD
    RESEARCH:  { x: 680, y: 130 }, // Expansão Lateral Topo
    FACTORY:   { x: 100, y: 275 }, // Expansão Lateral Meio + Subida
    BARRACKS:  { x: 700, y: 275 }, // Expansão Lateral Meio + Subida
    AIRPORT:   { x: 400, y: 480 }, // GOLD
    WALL:      { x: 400, y: 560 }, // GOLD
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
