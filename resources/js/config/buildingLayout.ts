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
    // LAYOUT DETERMINÍSTICO V13.2 — ASSENTAMENTO FINAL (terrain_v12)
    qg:                 { x: 550, y: 415, w: 260, h: 260, anchor: 'bottom', assetName: 'qg.png' },
    quartel:            { x: 730, y: 375, w: 120, h: 120, anchor: 'bottom', assetName: 'quartel.png' },
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
    housing:            { x: 190, y: 235, w: 110, h: 110, anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 855, y: 235, w: 110, h: 110, anchor: 'bottom', assetName: 'housing.png' },
};
