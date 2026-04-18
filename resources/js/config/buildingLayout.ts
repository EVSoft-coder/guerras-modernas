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
    // LAYOUT DETERMINÍSTICO V12.1 — COORDENADAS REAIS
    qg:                 { x: 400, y: 270, w: 180, h: 180, anchor: 'bottom', assetName: 'qg.png' },
    quartel:            { x: 630, y: 320, w: 110, h: 110, anchor: 'bottom', assetName: 'quartel.png' },
    fabrica_municoes:   { x: 230, y: 320, w: 110, h: 110, anchor: 'bottom', assetName: 'fabrica_municoes.png' },
    central_energia:    { x: 340, y: 170, w: 90,  h: 90,  anchor: 'bottom', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 620, y: 180, w: 90,  h: 90,  anchor: 'bottom', assetName: 'centro_pesquisa.png' },
    radar_estrategico:  { x: 180, y: 210, w: 90,  h: 90,  anchor: 'bottom', assetName: 'radar_estrategico.png' },
    aerodromo:          { x: 400, y: 400, w: 120, h: 120, anchor: 'bottom', assetName: 'aerodromo.png' },
    muralha:            { x: 400, y: 520, w: 260, h: 110, anchor: 'center', assetName: 'muralha.png' },
    
    // Fallbacks para edifícios não listados mas necessários
    refinaria:          { x: 660, y: 450, w: 110, h: 110, anchor: 'bottom', assetName: 'fabrica_municoes.png' },
    mina_suprimentos:   { x: 140, y: 450, w: 100, h: 100, anchor: 'bottom', assetName: 'mine.png' },
    mina_metal:         { x: 400, y: 490, w: 120, h: 120, anchor: 'bottom', assetName: 'mine.png' },
    housing:            { x: 80,  y: 100, w: 110, h: 110, anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 720, y: 100, w: 110, h: 110, anchor: 'bottom', assetName: 'housing.png' },
};
