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
    // LAYOUT DETERMINÍSTICO V12.5 — ALINHAMENTO COM PLATAFORMAS (terrain_v12)
    qg:                 { x: 400, y: 285, w: 180, h: 180, anchor: 'bottom', assetName: 'qg.png' },
    quartel:            { x: 770, y: 440, w: 110, h: 110, anchor: 'bottom', assetName: 'quartel.png' },
    fabrica_municoes:   { x: 290, y: 440, w: 110, h: 110, anchor: 'bottom', assetName: 'fabrica_municoes.png' },
    central_energia:    { x: 440, y: 190, w: 90,  h: 90,  anchor: 'bottom', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 770, y: 195, w: 90,  h: 90,  anchor: 'bottom', assetName: 'centro.png' },
    radar_estrategico:  { x: 220, y: 275, w: 90,  h: 90,  anchor: 'bottom', assetName: 'radar.png' },
    aerodromo:          { x: 500, y: 555, w: 120, h: 120, anchor: 'bottom', assetName: 'aerodromo.png' },
    muralha:            { x: 400, y: 580, w: 260, h: 110, anchor: 'bottom', assetName: 'muralha.png' },
    
    // Fallbacks e Edifícios Secundários
    refinaria:          { x: 840, y: 560, w: 110, h: 110, anchor: 'bottom', assetName: 'refinaria.png' },
    mina_suprimentos:   { x: 170, y: 560, w: 100, h: 100, anchor: 'bottom', assetName: 'mina.png' },
    mina_metal:         { x: 400, y: 570, w: 120, h: 120, anchor: 'bottom', assetName: 'mina.png' },
    housing:            { x: 110, y: 200, w: 110, h: 110, anchor: 'bottom', assetName: 'complexo.png' },
    posto_recrutamento: { x: 890, y: 200, w: 110, h: 110, anchor: 'bottom', assetName: 'posto.png' },
};
