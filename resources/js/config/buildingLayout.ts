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
    // CALIBRAÇÃO VISUAL V9 (DESLOCAMENTO PARA PADS REAIS)
    qg:                 { x: 490, y: 430, w: 220, h: 220, anchor: 'bottom', assetName: 'hq.png' },

    // ANEL SUPERIOR (SINTONIZADO COM PADS DE TERRENO)
    central_energia:    { x: 340, y: 190, w: 90,  h: 90,  anchor: 'bottom', assetName: 'energy.png' },
    centro_pesquisa:    { x: 740, y: 220, w: 110, h: 110, anchor: 'bottom', assetName: 'research.png' },
    radar_estrategico:  { x: 230, y: 310, w: 100, h: 100, anchor: 'bottom', assetName: 'radar.png' },
    parlamento:         { x: 520, y: 160, w: 110, h: 110, anchor: 'bottom', assetName: 'research.png' },

    // ANEL MÉDIO
    quartel:            { x: 780, y: 440, w: 120, h: 120, anchor: 'bottom', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 200, y: 480, w: 125, h: 125, anchor: 'bottom', assetName: 'factory.png' },
    refinaria:          { x: 430, y: 240, w: 100, h: 100, anchor: 'bottom', assetName: 'factory.png' },
    housing:            { x: 140, y: 280, w: 85,  h: 85,  anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 760, y: 140, w: 90,  h: 90,  anchor: 'bottom', assetName: 'housing.png' },

    // VANGUARDA (PAD INFERIOR E LATERAIS)
    aerodromo:          { x: 500, y: 640, w: 200, h: 200, anchor: 'bottom', assetName: 'aerodrome.png' },
    mina_metal:         { x: 880, y: 550, w: 130, h: 130, anchor: 'bottom', assetName: 'mine.png' },
    mina_suprimentos:   { x: 120, y: 150, w: 100, h: 100, anchor: 'bottom', assetName: 'mine.png' },
    
    // PERÍMETRO
    muralha:            { x: 400, y: 580, w: 420, h: 180, anchor: 'center', assetName: 'wall.png' },
};
