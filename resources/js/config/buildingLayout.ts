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
    // PRECISÃO MILIMÉTRICA V10 (SONDA DE RECONHECIMENTO FINAL)
    qg:                 { x: 470, y: 340, w: 220, h: 220, anchor: 'center', assetName: 'hq.png' },

    // ANEL SUPERIOR
    central_energia:    { x: 410, y: 210, w: 100, h: 100, anchor: 'center', assetName: 'energy.png' },
    centro_pesquisa:    { x: 530, y: 200, w: 100, h: 100, anchor: 'center', assetName: 'research.png' },
    radar_estrategico:  { x: 220, y: 280, w: 110, h: 110, anchor: 'center', assetName: 'radar.png' },
    parlamento:         { x: 140, y: 130, w: 110, h: 110, anchor: 'center', assetName: 'research.png' },

    // INDÚSTRIA E RECURSOS
    mina_suprimentos:   { x: 125, y: 245, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
    quartel:            { x: 630, y: 240, w: 120, h: 120, anchor: 'center', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 130, y: 410, w: 130, h: 130, anchor: 'center', assetName: 'factory.png' },
    refinaria:          { x: 350, y: 470, w: 120, h: 120, anchor: 'center', assetName: 'factory.png' },

    // LOGÍSTICA
    aerodromo:          { x: 590, y: 475, w: 220, h: 220, anchor: 'center', assetName: 'aerodrome.png' },
    housing:            { x: 325, y: 100, w: 100, h: 100, anchor: 'center', assetName: 'housing.png' },
    posto_recrutamento: { x: 725, y: 430, w: 100, h: 100, anchor: 'center', assetName: 'housing.png' },
    
    // PERÍMETRO
    mina_metal:         { x: 640, y: 350, w: 130, h: 130, anchor: 'center', assetName: 'mine.png' },
    muralha:            { x: 465, y: 525, w: 420, h: 180, anchor: 'center', assetName: 'wall.png' },
};
