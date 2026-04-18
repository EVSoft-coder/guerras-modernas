export interface BuildingLayout {
    x: number;
    y: number;
    w: number;
    h: number;
    anchor: 'center' | 'bottom';
}

export const REFERENCE_WIDTH = 800;
export const REFERENCE_HEIGHT = 600;

export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // HQ - PONTO FOCAL AMPLIADO (PASSO 5)
    qg:                 { x: 400, y: 260, w: 300, h: 300, anchor: 'center' },
    
    // MID ROW (ANCOHRED BOTTOM - PASSO 2)
    quartel:            { x: 260, y: 340, w: 150, h: 150, anchor: 'bottom' },
    refinaria:          { x: 580, y: 340, w: 150, h: 150, anchor: 'bottom' },
    
    // BACK ROW
    central_energia:    { x: 180, y: 240, w: 120, h: 120, anchor: 'center' },
    centro_pesquisa:    { x: 620, y: 240, w: 130, h: 130, anchor: 'center' },
    mina_suprimentos:   { x: 120, y: 150, w: 110, h: 110, anchor: 'center' },
    radar_estrategico:  { x: 280, y: 100, w: 100, h: 100, anchor: 'center' },
    
    // FRONT ROW
    aerodromo:          { x: 420, y: 500, w: 220, h: 220, anchor: 'center' },
    fabrica_municoes:   { x: 160, y: 460, w: 180, h: 180, anchor: 'center' },
    mina_metal:         { x: 700, y: 480, w: 140, h: 140, anchor: 'center' },
    posto_recrutamento: { x: 740, y: 360, w: 110, h: 110, anchor: 'center' },
    housing:            { x: 180, y: 320, w: 110, h: 110, anchor: 'center' },

    // MARGINALS
    muralha:            { x: 400, y: 540, w: 320, h: 160, anchor: 'center' },
    parlamento:         { x: 550, y: 560, w: 110, h: 110, anchor: 'center' },
};
