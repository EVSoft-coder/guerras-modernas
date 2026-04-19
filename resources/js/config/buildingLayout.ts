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
 * LAYOUT CALIBRADO V33 — PERÍMETRO DEFENSIVO
 * Muralha movida para o canto inferior direito com slot automático.
 * Aeródromo centralizado no pad inferior.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    qg:                 { x: 400, y: 260, w: 260, h: 260, anchor: 'center', assetName: 'qg.png' },
    
    // LINHA SUPERIOR
    radar_estrategico:  { x: 230, y: 80,  w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { x: 400, y: 70,  w: 100, h: 100, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 570, y: 80,  w: 120, h: 120, anchor: 'center', assetName: 'centro_pesquisa.png' },
    
    // LINHA INTERMÉDIA
    fabrica_municoes:   { x: 150, y: 320, w: 120, h: 120, anchor: 'center', assetName: 'fabrica_municoes.png' },
    quartel:            { x: 650, y: 320, w: 120, h: 120, anchor: 'center', assetName: 'quartel.png' },
    
    // RETAGUARDA E PERÍMETRO
    mina_suprimentos:   { x: 200, y: 530, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
    aerodromo:          { x: 400, y: 530, w: 140, h: 140, anchor: 'center', assetName: 'aerodromo.png' },
    muralha:            { x: 720, y: 560, w: 240, h: 120, anchor: 'center', assetName: 'muralha.png' }, // CANTO DIREITO FUNDO
    
    // OUTROS
    refinaria:          { x: 100, y: 500, w: 110, h: 110, anchor: 'center', assetName: 'fabrica_municoes.png' },
    housing:            { x: 800, y: 150, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
};
