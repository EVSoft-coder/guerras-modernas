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
    // LAYOUT DETERMINÍSTICO V12.7 — CALIBRAÇÃO FINAL (terrain_v12)
    qg:                 { x: 400, y: 300, w: 180, h: 180, anchor: 'bottom', assetName: 'qg.png' },
    quartel:            { x: 670, y: 450, w: 110, h: 110, anchor: 'bottom', assetName: 'quartel.png' },
    fabrica_municoes:   { x: 340, y: 450, w: 110, h: 110, anchor: 'bottom', assetName: 'fabrica_municoes.png' },
    central_energia:    { x: 440, y: 160, w: 90,  h: 90,  anchor: 'bottom', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 740, y: 160, w: 90,  h: 90,  anchor: 'bottom', assetName: 'centro_pesquisa.png' },
    radar_estrategico:  { x: 230, y: 285, w: 90,  h: 90,  anchor: 'bottom', assetName: 'radar_estrategico.png' },
    aerodromo:          { x: 550, y: 550, w: 120, h: 120, anchor: 'bottom', assetName: 'aerodromo.png' },
    muralha:            { x: 400, y: 580, w: 260, h: 110, anchor: 'bottom', assetName: 'muralha.png' },
    
    // Fallbacks e Edifícios de Produção
    refinaria:          { x: 800, y: 550, w: 110, h: 110, anchor: 'bottom', assetName: 'refinaria.png' },
    mina_suprimentos:   { x: 210, y: 560, w: 100, h: 100, anchor: 'bottom', assetName: 'mina_suprimentos.png' },
    mina_metal:         { x: 460, y: 580, w: 120, h: 120, anchor: 'bottom', assetName: 'mina_metal.png' },
    housing:            { x: 140, y: 160, w: 110, h: 110, anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 860, y: 160, w: 110, h: 110, anchor: 'bottom', assetName: 'posto_recrutamento.png' },
};
