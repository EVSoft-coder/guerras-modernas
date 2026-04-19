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
 * LAYOUT PAD-ABSOLUTO V35 — TERRAIN_V13
 * Alinhamento milimétrico com os 5 pads de betão 3D originais.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // CENTRAL
    qg:                 { x: 480, y: 380, w: 260, h: 260, anchor: 'center', assetName: 'qg.png' },
    
    // FLANCO SUPERIOR (Pads Visíveis)
    radar_estrategico:  { x: 260, y: 160, w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    centro_pesquisa:    { x: 710, y: 160, w: 120, h: 120, anchor: 'center', assetName: 'centro_pesquisa.png' },
    central_energia:    { x: 480, y: 140, w: 100, h: 100, anchor: 'center', assetName: 'central_energia.png' },
    
    // FLANCO INFERIOR (Pads Visíveis)
    fabrica_municoes:   { x: 280, y: 530, w: 130, h: 130, anchor: 'center', assetName: 'fabrica_municoes.png' },
    aerodromo:          { x: 680, y: 530, w: 150, h: 150, anchor: 'center', assetName: 'aerodromo.png' },
    
    // PERIFERIA (Sem Pad mas Limpos)
    quartel:            { x: 740, y: 380, w: 110, h: 110, anchor: 'center', assetName: 'quartel.png' },
    muralha:            { x: 800, y: 600, w: 240, h: 120, anchor: 'center', assetName: 'muralha.png' },
    mina_suprimentos:   { x: 200, y: 380, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
};
