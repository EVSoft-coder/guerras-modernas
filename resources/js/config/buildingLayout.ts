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
    // CALIBRAÇÃO POR RÓTULOS REAIS (V10 BLUEPRINT)
    qg:                 { x: 410, y: 340, w: 220, h: 220, anchor: 'center', assetName: 'hq.png' },

    // RECURSOS (SLOTS R1, R3, R4, R7)
    mina_metal:         { x: 370, y: 165, w: 100, h: 100, anchor: 'center', assetName: 'mine.png' },
    mina_suprimentos:   { x: 175, y: 280, w: 100, h: 100, anchor: 'center', assetName: 'mine.png' }, // R4
    refinaria:          { x: 380, y: 520, w: 110, h: 110, anchor: 'center', assetName: 'factory.png' }, // R3
    fabrica_municoes:   { x: 475, y: 485, w: 110, h: 110, anchor: 'center', assetName: 'factory.png' }, // R7 bot

    // CONTROLE & LOGÍSTICA (SLOTS C1, C2, C3, C6)
    quartel:            { x: 280, y: 230, w: 120, h: 120, anchor: 'center', assetName: 'barracks.png' }, // C1
    central_energia:    { x: 425, y: 135, w: 90,  h: 90,  anchor: 'center', assetName: 'energy.png' },   // C2
    centro_pesquisa:    { x: 570, y: 260, w: 120, h: 120, anchor: 'center', assetName: 'research.png' }, // C3
    aerodromo:          { x: 350, y: 580, w: 200, h: 200, anchor: 'center', assetName: 'aerodrome.png' }, // C6
    
    // OUTROS
    radar_estrategico:  { x: 475, y: 175, w: 110, h: 110, anchor: 'center', assetName: 'radar.png' }, // R7 top
    housing:            { x: 740, y: 440, w: 100, h: 100, anchor: 'center', assetName: 'housing.png' },
    posto_recrutamento: { x: 410, y: 60,  w: 90,  h: 90,  anchor: 'center', assetName: 'housing.png' },
    parlamento:         { x: 100, y: 100, w: 110, h: 110, anchor: 'center', assetName: 'research.png' },
    muralha:            { x: 410, y: 340, w: 550, h: 350, anchor: 'center', assetName: 'wall.png' },
};
