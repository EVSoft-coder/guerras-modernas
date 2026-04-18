export interface BuildingTier {
    minLevel: number;
    assetName: string;
}

export interface BuildingLayout {
    x: number;
    y: number;
    w: number;
    h: number;
    anchor: 'bottom' | 'center';
    assetName: string;
    tiers?: BuildingTier[]; // Evolução Visual (V20)
}

export const REFERENCE_WIDTH = 800;
export const REFERENCE_HEIGHT = 600;

export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // LAYOUT TRIBAL V20 — EVOLUÇÃO POR PATAMARES
    qg: { 
        x: 550, y: 415, w: 260, h: 260, anchor: 'bottom', assetName: 'qg.png',
        tiers: [
            { minLevel: 1,  assetName: 'qg.png' },
            { minLevel: 10, assetName: 'qg_v2.png' },
            { minLevel: 20, assetName: 'qg_v3.png' }
        ]
    },
    quartel: { 
        x: 730, y: 375, w: 120, h: 120, anchor: 'bottom', assetName: 'quartel.png',
        tiers: [
            { minLevel: 1,  assetName: 'quartel.png' },
            { minLevel: 15, assetName: 'quartel_v2.png' }
        ]
    },
    fabrica_municoes:   { x: 440, y: 565, w: 110, h: 110, anchor: 'bottom', assetName: 'fabrica_municoes.png' },
    central_energia:    { x: 440, y: 240, w: 90,  h: 90,  anchor: 'bottom', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 765, y: 255, w: 90,  h: 90,  anchor: 'bottom', assetName: 'centro_pesquisa.png' },
    radar_estrategico:  { x: 210, y: 375, w: 110, h: 110, anchor: 'bottom', assetName: 'radar_estrategico.png' },
    aerodromo:          { x: 620, y: 545, w: 140, h: 140, anchor: 'bottom', assetName: 'aerodromo.png' },
    muralha:            { x: 400, y: 590, w: 260, h: 110, anchor: 'bottom', assetName: 'muralha.png' },
    
    // Fallbacks e Unidades de Produção
    refinaria:          { x: 860, y: 575, w: 130, h: 130, anchor: 'bottom', assetName: 'fabrica_municoes.png' },
    mina_suprimentos:   { x: 340, y: 575, w: 110, h: 110, anchor: 'bottom', assetName: 'mine.png' },
    mina_metal:         { x: 505, y: 575, w: 110, h: 110, anchor: 'bottom', assetName: 'mine.png' },
    housing: { 
        x: 190, y: 235, w: 110, h: 110, anchor: 'bottom', assetName: 'housing.png',
        tiers: [
            { minLevel: 1,  assetName: 'housing.png' },
            { minLevel: 20, assetName: 'housing_v2.png' }
        ]
    },
    posto_recrutamento: { x: 855, y: 235, w: 110, h: 110, anchor: 'bottom', assetName: 'housing.png' },
};
