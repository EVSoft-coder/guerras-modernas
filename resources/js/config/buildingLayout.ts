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
 * LAYOUT RESET V21 — GRELHA CONTROLADA
 * Sistema fixo baseado em pontos centrais puros (800x600).
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    qg:                 { x: 400, y: 260, w: 200, h: 200, anchor: 'center', assetName: 'qg.png' },
    quartel:            { x: 620, y: 320, w: 110, h: 110, anchor: 'center', assetName: 'quartel.png' },
    fabrica_municoes:   { x: 220, y: 320, w: 110, h: 110, anchor: 'center', assetName: 'fabrica_municoes.png' },
    central_energia:    { x: 350, y: 180, w: 90,  h: 90,  anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 600, y: 180, w: 90,  h: 90,  anchor: 'center', assetName: 'centro_pesquisa.png' },
    radar_estrategico:  { x: 180, y: 200, w: 110, h: 110, anchor: 'center', assetName: 'radar_estrategico.png' },
    aerodromo:          { x: 400, y: 400, w: 140, h: 140, anchor: 'center', assetName: 'aerodromo.png' },
    muralha:            { x: 400, y: 520, w: 400, h: 120, anchor: 'center', assetName: 'muralha.png' },
    
    // Fallbacks (Mapeados para pontos seguros se não definidos explicitamente)
    refinaria:          { x: 100, y: 500, w: 110, h: 110, anchor: 'center', assetName: 'fabrica_municoes.png' },
    mina_suprimentos:   { x: 700, y: 500, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
    mina_metal:         { x: 700, y: 100, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
    housing:            { x: 100, y: 100, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
    posto_recrutamento: { x: 500, y: 80,  w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
};
