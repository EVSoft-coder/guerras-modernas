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
 * LAYOUT PIXEL PRECISION V51
 * Alinhamento total com o desenho do terreno visual.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // CENTRO
    qg:                 { x: 400, y: 300, w: 320, h: 320, anchor: 'center', assetName: 'qg.png' },
    
    // TOPO (ESTRATÉGICO)
    radar_estrategico:  { x: 200, y: 140, w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { x: 400, y: 120, w: 140, h: 140, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 600, y: 140, w: 140, h: 140, anchor: 'center', assetName: 'centro_pesquisa.png' },
    
    // LATERAIS (OPERACIONAL)
    fabrica_municoes:   { x: 220, y: 330, w: 180, h: 180, anchor: 'center', assetName: 'fabrica_municoes.png' },
    quartel:            { x: 580, y: 330, w: 180, h: 180, anchor: 'center', assetName: 'quartel.png' },
    
    // BASE (LOGÍSTICA / DEFESA)
    aerodromo:          { x: 400, y: 480, w: 200, h: 200, anchor: 'center', assetName: 'aerodromo.png' },
    muralha:            { x: 400, y: 560, w: 280, h: 100, anchor: 'center', assetName: 'muralha.png' },
};
