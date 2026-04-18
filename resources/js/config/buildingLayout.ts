export interface BuildingLayout {
    x: number;
    y: number;
    w: number;
    h: number;
    anchor: 'bottom' | 'center';
    assetName?: string;
}

export const REFERENCE_WIDTH = 800;
export const REFERENCE_HEIGHT = 600;

export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // LAYOUT DETERMINÍSTICO V12.1 — COORDENADAS REAIS (ALINHADAS AO SOLO)
    qg:                 { x: 400, y: 350, w: 180, h: 180, anchor: 'bottom', assetName: 'qg.png' },
    quartel:            { x: 630, y: 380, w: 110, h: 110, anchor: 'bottom', assetName: 'quartel.png' },
    fabrica_municoes:   { x: 230, y: 380, w: 110, h: 110, anchor: 'bottom', assetName: 'fabrica_municoes.png' },
    central_energia:    { x: 340, y: 220, w: 90,  h: 90,  anchor: 'bottom', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 620, y: 230, w: 90,  h: 90,  anchor: 'bottom', assetName: 'centro_pesquisa.png' },
    radar_estrategico:  { x: 180, y: 250, w: 90,  h: 90,  anchor: 'bottom', assetName: 'radar_estrategico.png' },
    aerodromo:          { x: 400, y: 480, w: 120, h: 120, anchor: 'bottom', assetName: 'aerodromo.png' },
    muralha:            { x: 400, y: 560, w: 260, h: 110, anchor: 'bottom', assetName: 'muralha.png' },
    
    // Fallbacks para edifícios não listados mas necessários
    refinaria:          { x: 660, y: 500, w: 110, h: 110, anchor: 'bottom', assetName: 'fabrica_municoes.png' },
    mina_suprimentos:   { x: 140, y: 500, w: 100, h: 100, anchor: 'bottom', assetName: 'mine.png' },
    mina_metal:         { x: 400, y: 550, w: 120, h: 120, anchor: 'bottom', assetName: 'mine.png' },
    housing:            { x: 80,  y: 180, w: 110, h: 110, anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 720, y: 180, w: 110, h: 110, anchor: 'bottom', assetName: 'housing.png' },
};
