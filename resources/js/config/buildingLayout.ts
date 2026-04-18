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
    // LAYOUT ISOMÉTRICO "TRIBAL STYLE" (REPLICAÇÃO AAA)
    qg:                 { x: 400, y: 320, w: 200, h: 200, anchor: 'bottom', assetName: 'hq.png' },

    // ANEL SUPERIOR (RETROGUARDA)
    central_energia:    { x: 300, y: 180, w: 90,  h: 90,  anchor: 'bottom', assetName: 'energy.png' },
    centro_pesquisa:    { x: 620, y: 180, w: 100, h: 100, anchor: 'bottom', assetName: 'research.png' },
    radar_estrategico:  { x: 200, y: 220, w: 100, h: 100, anchor: 'bottom', assetName: 'radar.png' },
    parlamento:         { x: 500, y: 150, w: 110, h: 110, anchor: 'bottom', assetName: 'research.png' },

    // ANEL MÉDIO (INDÚSTRIA E LOGÍSTICA)
    quartel:            { x: 650, y: 350, w: 120, h: 120, anchor: 'bottom', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 180, y: 380, w: 120, h: 120, anchor: 'bottom', assetName: 'factory.png' },
    refinaria:          { x: 450, y: 220, w: 100, h: 100, anchor: 'bottom', assetName: 'factory.png' },
    housing:            { x: 120, y: 280, w: 90,  h: 90,  anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 740, y: 250, w: 90,  h: 90,  anchor: 'bottom', assetName: 'housing.png' },

    // FRONTAL (VANGUARDA)
    aerodromo:          { x: 420, y: 520, w: 180, h: 180, anchor: 'bottom', assetName: 'aerodrome.png' },
    mina_metal:         { x: 700, y: 500, w: 120, h: 120, anchor: 'bottom', assetName: 'mine.png' },
    mina_suprimentos:   { x: 100, y: 150, w: 100, h: 100, anchor: 'bottom', assetName: 'mine.png' },
    
    // PERÍMETRO
    muralha:            { x: 400, y: 560, w: 400, h: 180, anchor: 'center', assetName: 'wall.png' },
};
