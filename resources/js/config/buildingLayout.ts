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
 * LAYOUT DE ELITE V37 — TERRENO V13 INTEGRAL
 * Cada edifício ocupa um dos 7 pads de betão visíveis na imagem.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // 1. PAD CENTRAL MESTRE
    qg:                 { x: 480, y: 310, w: 260, h: 260, anchor: 'center', assetName: 'qg.png' },
    
    // 2. FILA SUPERIOR (3 PADS)
    radar_estrategico:  { x: 260, y: 160, w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { x: 480, y: 80,  w: 100, h: 100, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 740, y: 160, w: 120, h: 120, anchor: 'center', assetName: 'centro_pesquisa.png' },
    
    // 3. FILA INTERMÉDIA (2 PADS LATERAIS)
    fabrica_municoes:   { x: 200, y: 300, w: 130, h: 130, anchor: 'center', assetName: 'fabrica_municoes.png' },
    quartel:            { x: 740, y: 300, w: 120, h: 120, anchor: 'center', assetName: 'quartel.png' },
    
    // 4. FILA INFERIOR (2 PADS)
    mina_suprimentos:   { x: 280, y: 530, w: 130, h: 130, anchor: 'center', assetName: 'mine.png' },
    aerodromo:          { x: 680, y: 530, w: 140, h: 140, anchor: 'center', assetName: 'aerodromo.png' },
    
    // PERÍMETRO
    muralha:            { x: 860, y: 560, w: 240, h: 120, anchor: 'center', assetName: 'muralha.png' },
};
