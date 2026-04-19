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
 * LAYOUT CALIBRADO V30 — ALINHAMENTO PIXEL-PERFECT (terrain_v13)
 * Coordenadas extraídas da análise visual da transmissão.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // NÚCLEO CENTRAL
    qg:                 { x: 400, y: 260, w: 260, h: 260, anchor: 'center', assetName: 'qg.png' },
    
    // LINHA SUPERIOR (TOP PADS)
    radar_estrategico:  { x: 230, y: 80,  w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { x: 400, y: 70,  w: 100, h: 100, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 570, y: 80,  w: 120, h: 120, anchor: 'center', assetName: 'centro_pesquisa.png' },
    
    // FLANCO INTERMÉDIO
    fabrica_municoes:   { x: 190, y: 300, w: 120, h: 120, anchor: 'center', assetName: 'fabrica_municoes.png' },
    quartel:            { x: 610, y: 300, w: 120, h: 120, anchor: 'center', assetName: 'quartel.png' },
    
    // FUNDO (BASE PADS)
    mina_suprimentos:   { x: 280, y: 530, w: 120, h: 120, anchor: 'center', assetName: 'mine.png' },
    aerodromo:          { x: 520, y: 530, w: 150, h: 150, anchor: 'center', assetName: 'aerodromo.png' },
    muralha:            { x: 400, y: 500, w: 400, h: 120, anchor: 'center', assetName: 'muralha.png' },
    
    // SLOTS PERIFÉRICOS
    refinaria:          { x: 100, y: 250, w: 110, h: 110, anchor: 'center', assetName: 'fabrica_municoes.png' },
    housing:            { x: 180, y: 440, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
};
