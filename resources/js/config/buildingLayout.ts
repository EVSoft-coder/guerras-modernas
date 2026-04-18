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

export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // REALINHAMENTO VISUAL BASEADO EM SCREENSHOT (HEX PAD CENTRAL)
    qg:                 { x: 498, y: 435, w: 230, h: 230, anchor: 'bottom', assetName: 'hq.png' },

    // ANEL SUPERIOR (BLUE CIRCLES & RED SQUARES)
    radar_estrategico:  { x: 230, y: 310, w: 100, h: 100, anchor: 'bottom', assetName: 'radar.png' },
    central_energia:    { x: 355, y: 195, w: 90,  h: 90,  anchor: 'bottom', assetName: 'energy.png' },
    centro_pesquisa:    { x: 760, y: 285, w: 110, h: 110, anchor: 'bottom', assetName: 'research.png' },

    // ANEL MÉDIO
    quartel:            { x: 780, y: 440, w: 120, h: 120, anchor: 'bottom', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 190, y: 460, w: 120, h: 120, anchor: 'bottom', assetName: 'factory.png' },
    refinaria:          { x: 410, y: 240, w: 100, h: 100, anchor: 'bottom', assetName: 'factory.png' },

    // ZONA FRONTAL (PADS INFERIORES)
    aerodromo:          { x: 495, y: 560, w: 180, h: 180, anchor: 'bottom', assetName: 'aerodrome.png' },

    // RECURSOS (EXTREMIDADES)
    mina_suprimentos:   { x: 140, y: 250, w: 110, h: 110, anchor: 'bottom', assetName: 'mine.png' },
    mina_metal:         { x: 860, y: 550, w: 120, h: 120, anchor: 'bottom', assetName: 'mine.png' },
    housing:            { x: 80,  y: 430, w: 90,  h: 90,  anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 740, y: 150, w: 90,  h: 90,  anchor: 'bottom', assetName: 'housing.png' },
    
    muralha:            { x: 500, y: 640, w: 380, h: 160, anchor: 'center', assetName: '' },
    parlamento:         { x: 520, y: 175, w: 100, h: 100, anchor: 'bottom', assetName: '' },
};
