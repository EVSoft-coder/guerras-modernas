export interface BuildingLayout {
    x: number;
    y: number;
    w: number;
    h: number;
    anchor: 'center' | 'bottom';
    assetName: string;
    xOffset?: number;
    yOffset?: number;
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
    AIRPORT:   { x: 268, y: 415 }, // Pad Sul-Oeste
    WALL:      { x: 400, y: 530 }, 
};

/**
 * ORDENAÇÃO VITAL V83: Calibração de Precisão Cirúrgica "Live Environment"
 * A renderização processa chaves por ordem. Y Menor (fundo) -> Y Maior (frente).
 * Valores refinados a partir do feedback visual direto intra-browser do servidor OVH.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // LINHA 1 (Fundo)
    central_energia:    { ...BUILDING_SLOTS.ENERGY, w: 90, h: 90, anchor: 'center', assetName: 'energia_v1.png', xOffset: 0, yOffset: 30 },
    
    // LINHA 2
    radar_estrategico:  { ...BUILDING_SLOTS.RADAR, w: 80, h: 90, anchor: 'center', assetName: 'radar_v1.png', xOffset: 25, yOffset: 25 },
    centro_pesquisa:    { ...BUILDING_SLOTS.RESEARCH, w: 90, h: 90, anchor: 'center', assetName: 'pesquisa_v1.png', xOffset: -10, yOffset: 25 },
    
    // LINHA 3 (Equador)
    fabrica_municoes:   { ...BUILDING_SLOTS.FACTORY, w: 100, h: 110, anchor: 'center', assetName: 'fabrica_v2.png', xOffset: 20, yOffset: 60 },
    qg:                 { ...BUILDING_SLOTS.HQ, w: 140, h: 160, anchor: 'center', assetName: 'hq_v2.png', xOffset: 10, yOffset: 60 },
    quartel:            { ...BUILDING_SLOTS.BARRACKS, w: 100, h: 110, anchor: 'center', assetName: 'quartel_v2.png', xOffset: -10, yOffset: 65 },
    
    // LINHA 4
    aerodromo:          { ...BUILDING_SLOTS.AIRPORT, w: 140, h: 120, anchor: 'center', assetName: 'aerodromo_v1.png', xOffset: 35, yOffset: 35 },
    
    // LINHA 5 (Frente)
    muralha:            { ...BUILDING_SLOTS.WALL, w: 200, h: 80, anchor: 'center', assetName: 'muralha_v1.png', xOffset: 15, yOffset: 50 },
};
