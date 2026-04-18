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
    // AJUSTE AAA (PASSO 1 & 2)
    qg:                 { x: 400, y: 270, w: 180, h: 180, anchor: 'bottom', assetName: 'hq.png' },

    radar_estrategico:  { x: 195, y: 215, w: 85,  h: 85,  anchor: 'bottom', assetName: 'radar.png' },
    central_energia:    { x: 345, y: 175, w: 85,  h: 85,  anchor: 'bottom', assetName: 'energy.png' },
    centro_pesquisa:    { x: 610, y: 185, w: 85,  h: 85,  anchor: 'bottom', assetName: 'research.png' },

    quartel:            { x: 625, y: 325, w: 105, h: 105, anchor: 'bottom', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 235, y: 325, w: 105, h: 105, anchor: 'bottom', assetName: 'factory.png' },
    refinaria:          { x: 745, y: 245, w: 90,  h: 90,  anchor: 'bottom', assetName: 'factory.png' },

    aerodromo:          { x: 400, y: 400, w: 120, h: 120, anchor: 'bottom', assetName: 'aerodrome.png' },

    mina_suprimentos:   { x: 130, y: 155, w: 85,  h: 85,  anchor: 'bottom', assetName: 'mine.png' },
    mina_metal:         { x: 710, y: 485, w: 100, h: 100, anchor: 'bottom', assetName: 'mine.png' },
    housing:            { x: 145, y: 285, w: 75,  h: 75,  anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 755, y: 365, w: 75,  h: 75,  anchor: 'bottom', assetName: 'housing.png' },
    
    muralha:            { x: 400, y: 520, w: 260, h: 110, anchor: 'center', assetName: '' },
    parlamento:         { x: 550, y: 565, w: 80,  h: 80,  anchor: 'bottom', assetName: '' },
};
