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
    // AJUSTE CIRÚRGICO REAL (PASSO 1 & 2)
    qg:                 { x: 400, y: 270, w: 220, h: 220, anchor: 'bottom', assetName: 'hq.png' },

    radar_estrategico:  { x: 180, y: 210, w: 90,  h: 90,  anchor: 'bottom', assetName: 'radar.png' },
    central_energia:    { x: 340, y: 170, w: 90,  h: 90,  anchor: 'bottom', assetName: 'energy.png' },
    centro_pesquisa:    { x: 620, y: 180, w: 90,  h: 90,  anchor: 'bottom', assetName: 'research.png' },

    quartel:            { x: 630, y: 320, w: 110, h: 110, anchor: 'bottom', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 230, y: 320, w: 110, h: 110, anchor: 'bottom', assetName: 'factory.png' },
    refinaria:          { x: 740, y: 240, w: 100, h: 100, anchor: 'bottom', assetName: 'factory.png' },

    aerodromo:          { x: 400, y: 380, w: 130, h: 130, anchor: 'bottom', assetName: 'aerodrome.png' },

    muralha:            { x: 400, y: 520, w: 260, h: 110, anchor: 'center', assetName: '' },

    // OUTROS EDIFÍCIOS (AJUSTADOS PROPORCIONALMENTE)
    mina_suprimentos:   { x: 120, y: 150, w: 90,  h: 90,  anchor: 'bottom', assetName: 'mine.png' },
    mina_metal:         { x: 700, y: 480, w: 100, h: 100, anchor: 'bottom', assetName: 'mine.png' },
    housing:            { x: 140, y: 280, w: 80,  h: 80,  anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 750, y: 360, w: 80,  h: 80,  anchor: 'bottom', assetName: 'housing.png' },
    parlamento:         { x: 550, y: 560, w: 80,  h: 80,  anchor: 'bottom', assetName: '' },
};
