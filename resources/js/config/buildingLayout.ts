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
    // PRECISÃO PREMIUM V10 (BLUEPRINT SYNCHRONIZED)
    qg:                 { x: 490, y: 320, w: 220, h: 220, anchor: 'center', assetName: 'hq.png' },

    // INTEL & RESEARCH
    radar_estrategico:  { x: 230, y: 260, w: 100, h: 100, anchor: 'center', assetName: 'radar.png' },
    central_energia:    { x: 430, y: 190, w: 100, h: 100, anchor: 'center', assetName: 'energy.png' },
    centro_pesquisa:    { x: 550, y: 180, w: 100, h: 100, anchor: 'center', assetName: 'research.png' },
    parlamento:         { x: 700, y: 150, w: 110, h: 110, anchor: 'center', assetName: 'research.png' },

    // PRODUCTION & RESOURCES
    quartel:            { x: 740, y: 250, w: 110, h: 110, anchor: 'center', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 140, y: 440, w: 120, h: 120, anchor: 'center', assetName: 'factory.png' },
    refinaria:          { x: 140, y: 550, w: 120, h: 120, anchor: 'center', assetName: 'factory.png' },
    mina_suprimentos:   { x: 140, y: 240, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
    mina_metal:         { x: 860, y: 550, w: 130, h: 130, anchor: 'center', assetName: 'mine.png' },

    // LOGISTICS
    aerodromo:          { x: 650, y: 420, w: 220, h: 220, anchor: 'center', assetName: 'aerodrome.png' },
    housing:            { x: 280, y: 110, w: 90,  h: 90,  anchor: 'center', assetName: 'housing.png' },
    posto_recrutamento: { x: 760, y: 100, w: 90,  h: 90,  anchor: 'center', assetName: 'housing.png' },
    
    // PERIMETER
    muralha:            { x: 400, y: 560, w: 420, h: 180, anchor: 'center', assetName: 'wall.png' },
};
