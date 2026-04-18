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
    qg:                 { x: 400, y: 300, w: 260, h: 260, anchor: 'center' },
    quartel:            { x: 200, y: 340, w: 140, h: 140, anchor: 'bottom' },
    fabrica_municoes:   { x: 160, y: 480, w: 160, h: 160, anchor: 'bottom' },
    central_energia:    { x: 380, y: 100, w: 120, h: 120, anchor: 'center' },
    mina_suprimentos:   { x: 120, y: 180, w: 110, h: 110, anchor: 'center' },
    mina_metal:         { x: 700, y: 480, w: 130, h: 130, anchor: 'center' },
    refinaria:          { x: 720, y: 240, w: 120, h: 120, anchor: 'center' },
    centro_pesquisa:    { x: 640, y: 100, w: 130, h: 130, anchor: 'center' },
    aerodromo:          { x: 420, y: 520, w: 220, h: 220, anchor: 'center' },
    housing:            { x: 260, y: 220, w: 100, h: 100, anchor: 'center' },
    posto_recrutamento: { x: 620, y: 350, w: 100, h: 100, anchor: 'center' },
    radar_estrategico:  { x: 250, y: 100, w: 90, h: 90, anchor: 'center' },
    muralha:            { x: 400, y: 560, w: 240, h: 140, anchor: 'center' },
    parlamento:         { x: 500, y: 580, w: 110, h: 110, anchor: 'center' },
};
