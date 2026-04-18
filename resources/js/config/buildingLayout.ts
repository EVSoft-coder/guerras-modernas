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
    // LAYOUT MASTERPIECE V11.2 (PRECISION GRID)
    // Escalas ajustadas: HQ (160), Circles (130), Rects (110)
    
    qg:                 { x: 400, y: 310, w: 160, h: 160, anchor: 'center', assetName: 'hq.png' },

    // SECTORES TÁTICOS (CIRCLES & RECTS)
    radar_estrategico:  { x: 410, y: 175, w: 110, h: 110, anchor: 'center', assetName: 'radar.png' },
    central_energia:    { x: 485, y: 235, w: 110, h: 110, anchor: 'center', assetName: 'energy.png' },
    centro_pesquisa:    { x: 615, y: 310, w: 120, h: 120, anchor: 'center', assetName: 'research.png' },
    parlamento:         { x: 185, y: 310, w: 120, h: 120, anchor: 'center', assetName: 'research.png' },

    // INDÚSTRIA & RECURSOS
    quartel:            { x: 315, y: 235, w: 100, h: 100, anchor: 'center', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 260, y: 310, w: 110, h: 110, anchor: 'center', assetName: 'factory.png' },
    refinaria:          { x: 540, y: 310, w: 110, h: 110, anchor: 'center', assetName: 'factory.png' },
    mina_suprimentos:   { x: 315, y: 385, w: 100, h: 100, anchor: 'center', assetName: 'mine.png' },
    mina_metal:         { x: 410, y: 480, w: 130, h: 130, anchor: 'center', assetName: 'mine.png' },

    // LOGÍSTICA & EXTERIOR
    aerodromo:          { x: 410, y: 550, w: 180, h: 180, anchor: 'bottom', assetName: 'aerodrome.png' },
    housing:            { x: 100, y: 120, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
    posto_recrutamento: { x: 700, y: 120, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
    muralha:            { x: 400, y: 310, w: 500, h: 320, anchor: 'center', assetName: 'wall.png' },
};
