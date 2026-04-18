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
    // LAYOUT MASTERPIECE V11 (CINEMATIC GROUNDING)
    qg:                 { x: 408, y: 314, w: 220, h: 220, anchor: 'center', assetName: 'hq.png' },

    // INTEL & RESEARCH (SLOTS SUPERIORES)
    radar_estrategico:  { x: 436, y: 87,  w: 100, h: 100, anchor: 'center', assetName: 'radar.png' },
    central_energia:    { x: 401, y: 196, w: 100, h: 100, anchor: 'center', assetName: 'energy.png' },
    centro_pesquisa:    { x: 511, y: 211, w: 100, h: 100, anchor: 'center', assetName: 'research.png' },
    parlamento:         { x: 206, y: 311, w: 110, h: 110, anchor: 'center', assetName: 'research.png' },

    // INDÚSTRIA & RECURSOS (ZONAS CONCRETAS)
    quartel:            { x: 321, y: 271, w: 110, h: 110, anchor: 'center', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 610, y: 301, w: 120, h: 120, anchor: 'center', assetName: 'factory.png' },
    refinaria:          { x: 770, y: 471, w: 120, h: 120, anchor: 'center', assetName: 'factory.png' },
    mina_suprimentos:   { x: 501, y: 431, w: 100, h: 100, anchor: 'center', assetName: 'mine.png' },
    mina_metal:         { x: 511, y: 521, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },

    // LOGÍSTICA & DEFESA
    aerodromo:          { x: 416, y: 556, w: 200, h: 200, anchor: 'center', assetName: 'aerodrome.png' },
    housing:            { x: 100, y: 100, w: 90,  h: 90,  anchor: 'center', assetName: 'housing.png' },
    posto_recrutamento: { x: 700, y: 100, w: 90,  h: 90,  anchor: 'center', assetName: 'housing.png' },
    muralha:            { x: 408, y: 314, w: 550, h: 350, anchor: 'center', assetName: 'wall.png' },
};
