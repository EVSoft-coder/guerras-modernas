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
 * LAYOUT DE BALANCEAMENTO V53
 * HQ Redimensionado para evitar dominância excessiva e libertar espaço.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // CENTRO (Redimensionado para 220px de base)
    qg:                 { x: 400, y: 300, w: 220, h: 260, anchor: 'center', assetName: 'qg.png' },
    
    // TOPO
    radar_estrategico:  { x: 200, y: 140, w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { x: 400, y: 120, w: 140, h: 140, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 600, y: 140, w: 140, h: 140, anchor: 'center', assetName: 'centro_pesquisa.png' },
    
    // LATERAIS
    fabrica_municoes:   { x: 220, y: 330, w: 180, h: 180, anchor: 'center', assetName: 'fabrica_municoes.png' },
    quartel:            { x: 580, y: 330, w: 180, h: 180, anchor: 'center', assetName: 'quartel.png' },
    
    // BASE
    aerodromo:          { x: 400, y: 480, w: 200, h: 200, anchor: 'center', assetName: 'aerodromo.png' },
    muralha:            { x: 400, y: 560, w: 280, h: 100, anchor: 'center', assetName: 'muralha.png' },
};
