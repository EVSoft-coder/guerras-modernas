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
 * LAYOUT DE ALINHAMENTO ABSOLUTO V43
 * Coordenadas de comando para encaixe perfeito nos pads.
 * Ancoragem: Bottom-Center (Implementada em BuildingNode).
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // CENTRO DE COMANDO
    qg:                 { x: 400, y: 300, w: 320, h: 320, anchor: 'center', assetName: 'qg.png' },
    
    // LINHA DE OPERAÇÕES (CENTRAL)
    fabrica_municoes:   { x: 150, y: 350, w: 180, h: 180, anchor: 'center', assetName: 'fabrica_municoes.png' },
    quartel:            { x: 650, y: 350, w: 180, h: 180, anchor: 'center', assetName: 'quartel.png' },
    
    // LINHA ESTRATÉGICA (TOPO)
    radar_estrategico:  { x: 150, y: 150, w: 120, h: 120, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { x: 400, y: 120, w: 140, h: 140, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 650, y: 150, w: 140, h: 140, anchor: 'center', assetName: 'centro_pesquisa.png' },
    
    // LOGÍSTICA (FUNDO)
    aerodromo:          { x: 400, y: 500, w: 200, h: 200, anchor: 'center', assetName: 'aerodromo.png' },

    // PERÍMETRO DEFENSIVO
    muralha:            { x: 400, y: 580, w: 280, h: 100, anchor: 'center', assetName: 'muralha.png' },
};
