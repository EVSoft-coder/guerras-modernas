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
    // LAYOUT MASTERPIECE V11.3 (SISTEMA DE DISPERSÃO TOTAL)
    // Coordenadas calculadas para o grid 800x600 real
    
    qg:                 { x: 400, y: 310, w: 160, h: 160, anchor: 'center', assetName: 'hq.png' },

    // SECTORES TÁTICOS (CIRCLES & RECTS) - DISPERSÃO ALFA
    radar_estrategico:  { x: 400, y: 130, w: 100, h: 100, anchor: 'center', assetName: 'radar.png' },    // C1 (Norte)
    central_energia:    { x: 530, y: 200, w: 100, h: 100, anchor: 'center', assetName: 'energy.png' },   // R7 (NE)
    centro_pesquisa:    { x: 590, y: 310, w: 110, h: 110, anchor: 'center', assetName: 'research.png' }, // R6 (Leste)
    parlamento:         { x: 140, y: 310, w: 110, h: 110, anchor: 'center', assetName: 'research.png' }, // C2 (Oeste)

    // INDÚSTRIA & RECURSOS (DISPERSÃO BETA)
    quartel:            { x: 270, y: 200, w: 100, h: 100, anchor: 'center', assetName: 'barracks.png' }, // R1 (NW)
    fabrica_municoes:   { x: 210, y: 310, w: 100, h: 100, anchor: 'center', assetName: 'factory.png' },  // R4 (Oeste)
    refinaria:          { x: 660, y: 310, w: 110, h: 110, anchor: 'center', assetName: 'factory.png' },  // C3 (Leste)
    mina_suprimentos:   { x: 270, y: 420, w: 100, h: 100, anchor: 'center', assetName: 'mine.png' },     // R3 (SW)
    mina_metal:         { x: 400, y: 490, w: 120, h: 120, anchor: 'center', assetName: 'mine.png' },     // C6 (Sul)

    // LOGÍSTICA & EXTERIOR
    aerodromo:          { x: 400, y: 560, w: 180, h: 180, anchor: 'bottom', assetName: 'aerodrome.png' },
    housing:            { x: 80,  y: 100, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
    posto_recrutamento: { x: 720, y: 100, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
    muralha:            { x: 400, y: 310, w: 520, h: 340, anchor: 'center', assetName: 'wall.png' },
};
