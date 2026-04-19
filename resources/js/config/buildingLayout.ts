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
 * LAYOUT DE ESCALA CONSISTENTE V40
 * Alturas fixas para garantir hierarquia visual e coerência tática.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // COMANDO (DOMINANTE)
    qg:                 { x: 480, y: 310, w: 320, h: 320, anchor: 'center', assetName: 'qg.png' },
    
    // FILA SUPERIOR (Métrica 120-140px)
    radar_estrategico:  { x: 260, y: 160, w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { x: 480, y: 80,  w: 140, h: 140, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 740, y: 160, w: 140, h: 140, anchor: 'center', assetName: 'centro_pesquisa.png' },
    
    // FILA INTERMÉDIA (Métrica 180px)
    fabrica_municoes:   { x: 200, y: 300, w: 180, h: 180, anchor: 'center', assetName: 'fabrica_municoes.png' },
    quartel:            { x: 740, y: 300, w: 180, h: 180, anchor: 'center', assetName: 'quartel.png' },
    
    // FILA INFERIOR (Métrica 110-200px)
    mina_suprimentos:   { x: 280, y: 530, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
    aerodromo:          { x: 680, y: 530, w: 200, h: 200, anchor: 'center', assetName: 'aerodromo.png' },
    
    // PERÍMETRO (Métrica 100px altura)
    muralha:            { x: 860, y: 560, w: 240, h: 100, anchor: 'center', assetName: 'muralha.png' },
};
