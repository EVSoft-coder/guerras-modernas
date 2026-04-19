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
 * LAYOUT CALIBRADO V28 — ALINHAMENTO COM TERRENO V13
 * Coordenadas ajustadas para os círculos visuais do background.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    qg:                 { x: 400, y: 300, w: 200, h: 200, anchor: 'center', assetName: 'qg.png' },
    quartel:            { x: 620, y: 110, w: 110, h: 110, anchor: 'center', assetName: 'quartel.png' },
    fabrica_municoes:   { x: 230, y: 535, w: 110, h: 110, anchor: 'center', assetName: 'fabrica_municoes.png' },
    central_energia:    { x: 400, y: 110, w: 90,  h: 90,  anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 780, y: 250, w: 90,  h: 90,  anchor: 'center', assetName: 'centro_pesquisa.png' },
    radar_estrategico:  { x: 180, y: 110, w: 110, h: 110, anchor: 'center', assetName: 'radar_estrategico.png' },
    aerodromo:          { x: 550, y: 535, w: 140, h: 140, anchor: 'center', assetName: 'aerodromo.png' },
    muralha:            { x: 400, y: 520, w: 400, h: 120, anchor: 'center', assetName: 'muralha.png' },
    
    // Unidades de Produção em slots periféricos
    refinaria:          { x: 100, y: 250, w: 110, h: 110, anchor: 'center', assetName: 'fabrica_municoes.png' },
    mina_suprimentos:   { x: 300, y: 150, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
    mina_metal:         { x: 500, y: 150, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
    housing:            { x: 180, y: 340, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
    posto_recrutamento: { x: 800, y: 500, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
};
