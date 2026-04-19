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

// SISTEMA DE COERÊNCIA V55 (Linhas de Latitude)
const ROW_TOP = 120;
const ROW_MID = 300;
const ROW_BOTTOM = 480;
const ROW_PERIMETER = 560; // 480 + 80 step

/**
 * LAYOUT DE COERÊNCIA SISTÉMICA V55
 * Todos os edifícios alinham por filas invisíveis (Latitude Fixa).
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // FILA SUPERIOR (ROW_TOP: 120)
    radar_estrategico:  { x: 200, y: ROW_TOP, w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { x: 400, y: ROW_TOP, w: 140, h: 140, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 600, y: ROW_TOP, w: 140, h: 140, anchor: 'center', assetName: 'centro_pesquisa.png' },
    
    // FILA CENTRAL (ROW_MID: 300)
    qg:                 { x: 400, y: ROW_MID, w: 220, h: 260, anchor: 'center', assetName: 'qg.png' },
    fabrica_municoes:   { x: 180, y: ROW_MID + 30, w: 180, h: 180, anchor: 'center', assetName: 'fabrica_municoes.png' },
    quartel:            { x: 620, y: ROW_MID + 30, w: 180, h: 180, anchor: 'center', assetName: 'quartel.png' },
    
    // FILA INFERIOR (ROW_BOTTOM: 480)
    aerodromo:          { x: 400, y: ROW_BOTTOM, w: 200, h: 200, anchor: 'center', assetName: 'aerodromo.png' },
    
    // PERÍMETRO (ROW_PERIMETER: 560)
    muralha:            { x: 400, y: ROW_PERIMETER, w: 280, h: 100, anchor: 'center', assetName: 'muralha.png' },
};
