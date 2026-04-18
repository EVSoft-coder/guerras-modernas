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
    // REALINHAMENTO TOTAL V2 (MAPA V8)
    qg:                 { x: 550, y: 440, w: 230, h: 230, anchor: 'bottom', assetName: 'hq.png' },

    // ANEL SUPERIOR (PADS VERMELHOS E AZUIS TOPO)
    radar_estrategico:  { x: 230, y: 250, w: 100, h: 100, anchor: 'bottom', assetName: 'radar.png' },
    central_energia:    { x: 380, y: 180, w: 90,  h: 90,  anchor: 'bottom', assetName: 'energy.png' },
    centro_pesquisa:    { x: 740, y: 180, w: 110, h: 110, anchor: 'bottom', assetName: 'research.png' },

    // ANEL MÉDIO (PADS AZUIS LATERAIS)
    quartel:            { x: 780, y: 420, w: 120, h: 120, anchor: 'bottom', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 300, y: 550, w: 130, h: 130, anchor: 'bottom', assetName: 'factory.png' },
    refinaria:          { x: 440, y: 260, w: 110, h: 110, anchor: 'bottom', assetName: 'factory.png' },

    // FRONTAL (PAD GRANDE INFERIOR)
    aerodromo:          { x: 650, y: 680, w: 220, h: 220, anchor: 'bottom', assetName: 'aerodrome.png' },

    // EXTREMIDADES (MINAS E HABITAÇÃO)
    mina_suprimentos:   { x: 120, y: 180, w: 110, h: 110, anchor: 'bottom', assetName: 'mine.png' },
    mina_metal:         { x: 860, y: 580, w: 130, h: 130, anchor: 'bottom', assetName: 'mine.png' },
    housing:            { x: 140, y: 440, w: 110, h: 110, anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 750, y: 140, w: 90,  h: 90,  anchor: 'bottom', assetName: 'housing.png' },
    
    // DEFESA E POLÍTICA (MURALHA ATIVA)
    muralha:            { x: 400, y: 560, w: 420, h: 120, anchor: 'center', assetName: 'wall.png' },
    parlamento:         { x: 550, y: 150, w: 110, h: 110, anchor: 'bottom', assetName: 'research.png' },
};
