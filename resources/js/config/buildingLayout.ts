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
 * LAYOUT ALFA V36 — TERRENO V13 (Pads Reais)
 * Alinhamento milimétrico com os pratos 3D integrados na areia.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // PAD MESTRE (CENTRO)
    qg:                 { x: 480, y: 380, w: 260, h: 260, anchor: 'center', assetName: 'qg.png' },
    
    // PADS SUPERIORES (Flanco)
    radar_estrategico:  { x: 260, y: 160, w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { x: 480, y: 80,  w: 100, h: 100, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 710, y: 160, w: 120, h: 120, anchor: 'center', assetName: 'centro_pesquisa.png' },
    
    // PADS INFERIORES (Base)
    fabrica_municoes:   { x: 280, y: 530, w: 130, h: 130, anchor: 'center', assetName: 'fabrica_municoes.png' },
    aerodromo:          { x: 680, y: 530, w: 130, h: 130, anchor: 'center', assetName: 'aerodromo.png' },
    
    // PERIPHERY
    quartel:            { x: 100, y: 300, w: 110, h: 110, anchor: 'center', assetName: 'quartel.png' },
    muralha:            { x: 860, y: 540, w: 240, h: 120, anchor: 'center', assetName: 'muralha.png' },
    mina_suprimentos:   { x: 100, y: 500, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
};
