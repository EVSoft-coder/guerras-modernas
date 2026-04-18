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
    // HQ - REDUZIDO PARA EQUILIBRIO (PASSO 2)
    qg:                 { x: 400, y: 300, w: 180, h: 180, anchor: 'bottom', assetName: 'hq.png' },

    // INTEL RING
    radar_estrategico:  { x: 180, y: 220, w: 85,  h: 85,  anchor: 'bottom', assetName: 'radar.png' },
    central_energia:    { x: 340, y: 170, w: 85,  h: 85,  anchor: 'bottom', assetName: 'energy.png' },
    centro_pesquisa:    { x: 620, y: 190, w: 85,  h: 85,  anchor: 'bottom', assetName: 'research.png' },

    // PRODUCTION RING
    quartel:            { x: 630, y: 330, w: 105, h: 105, anchor: 'bottom', assetName: 'barracks.png' },
    fabrica_municoes:   { x: 230, y: 330, w: 105, h: 105, anchor: 'bottom', assetName: 'factory.png' },
    refinaria:          { x: 740, y: 260, w: 90,  h: 90,  anchor: 'bottom', assetName: 'factory.png' },

    // FRONT LINE - REALINHADO (PASSO 3)
    aerodromo:          { x: 400, y: 410, w: 120, h: 120, anchor: 'bottom', assetName: 'aerodrome.png' },

    // RESOURCE QUARTER
    mina_suprimentos:   { x: 120, y: 160, w: 85,  h: 85,  anchor: 'bottom', assetName: 'mine.png' },
    mina_metal:         { x: 700, y: 490, w: 100, h: 100, anchor: 'bottom', assetName: 'mine.png' },
    housing:            { x: 140, y: 290, w: 75,  h: 75,  anchor: 'bottom', assetName: 'housing.png' },
    posto_recrutamento: { x: 750, y: 370, w: 75,  h: 75,  anchor: 'bottom', assetName: 'housing.png' },
    
    // DEFENSE & POLITICS
    muralha:            { x: 400, y: 530, w: 260, h: 110, anchor: 'center', assetName: '' },
    parlamento:         { x: 550, y: 570, w: 80,  h: 80,  anchor: 'bottom', assetName: '' },
};
