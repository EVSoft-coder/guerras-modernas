export interface BuildingLayout {
    x: number;
    y: number;
    w: number;
    h: number;
    anchor: 'center' | 'bottom';
    assetName: string; // Nome exato do ficheiro em public/assets/structures/v2/
}

export const REFERENCE_WIDTH = 800;
export const REFERENCE_HEIGHT = 600;

export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    qg:                 { x: 400, y: 260, w: 300, h: 300, anchor: 'center', assetName: 'hq.png' },
    quartel:            { x: 260, y: 340, w: 150, h: 150, anchor: 'bottom', assetName: 'barracks.png' },
    refinaria:          { x: 580, y: 340, w: 150, h: 150, anchor: 'bottom', assetName: 'factory.png' },
    central_energia:    { x: 180, y: 240, w: 120, h: 120, anchor: 'center', assetName: 'energy.png' },
    centro_pesquisa:    { x: 620, y: 240, w: 130, h: 130, anchor: 'center', assetName: 'research.png' },
    mina_suprimentos:   { x: 120, y: 150, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
    radar_estrategico:  { x: 280, y: 100, w: 100, h: 100, anchor: 'center', assetName: 'radar.png' },
    aerodromo:          { x: 420, y: 500, w: 220, h: 220, anchor: 'center', assetName: 'aerodrome.png' },
    fabrica_municoes:   { x: 160, y: 460, w: 180, h: 180, anchor: 'center', assetName: 'factory.png' },
    mina_metal:         { x: 700, y: 480, w: 140, h: 140, anchor: 'center', assetName: 'mine.png' },
    posto_recrutamento: { x: 740, y: 360, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
    housing:            { x: 180, y: 320, w: 110, h: 110, anchor: 'center', assetName: 'housing.png' },
    muralha:            { x: 400, y: 540, w: 320, h: 160, anchor: 'center', assetName: '' },
    parlamento:         { x: 550, y: 560, w: 110, h: 110, anchor: 'center', assetName: '' },
};
