export interface BuildingLayout {
    x: number;
    y: number;
    w: number;
    h: number;
    zIndex?: number; // Agora opcional, pois será dinâmico por padrão
    assetPath: string;
    anchor?: 'center' | 'bottom';
    offsetX?: number; // Ajuste fino X
    offsetY?: number; // Ajuste fino Y
    scale?: number;   // Escala individual do ativo
}

export const REFERENCE_WIDTH = 800;
export const REFERENCE_HEIGHT = 600;

export const BUILDING_LAYOUT_CONFIG: Record<string, BuildingLayout> = {
    // BACK ROW
    central_energia:    { x: 385, y: 70, w: 120, h: 120, assetPath: '/assets/structures/v2/energy.png', offsetX: 0, offsetY: 0, scale: 1.3 },
    mina_suprimentos:   { x: 140, y: 125, w: 120, h: 120, assetPath: '/assets/structures/v2/mine.png', offsetX: -5, offsetY: 0, scale: 1.2 },
    radar_estrategico:  { x: 265, y: 95, w: 100, h: 100, assetPath: '/assets/structures/v2/radar.png', offsetX: 0, offsetY: 0, scale: 1.1 },
    centro_pesquisa:    { x: 650, y: 140, w: 140, h: 140, assetPath: '/assets/structures/v2/research.png', offsetX: 10, offsetY: 0, scale: 1.3 },
    
    // MID ROW
    quartel:            { x: 220, y: 245, w: 160, h: 160, assetPath: '/assets/structures/v2/barracks.png', offsetX: 0, offsetY: 0, scale: 1.3 },
    refinaria:          { x: 740, y: 235, w: 130, h: 130, assetPath: '/assets/structures/v2/factory.png', offsetX: 5, offsetY: 0, scale: 1.2 },
    housing:            { x: 235, y: 350, w: 110, h: 110, assetPath: '/assets/structures/v2/housing.png', offsetX: -10, offsetY: 0, scale: 1.15 },
    
    // CENTER
    qg:                 { x: 450, y: 310, w: 300, h: 300, assetPath: '/assets/structures/v2/hq.png', offsetX: 0, offsetY: 0, scale: 1.5 },
    
    // FRONT ROW
    fabrica_municoes:   { x: 165, y: 475, w: 180, h: 180, assetPath: '/assets/structures/v2/factory.png', offsetX: 0, offsetY: 0, scale: 1.4 },
    aerodromo:          { x: 420, y: 510, w: 240, h: 240, assetPath: '/assets/structures/v2/aerodrome.png', offsetX: 0, offsetY: 0, scale: 1.4 },
    posto_recrutamento: { x: 670, y: 430, w: 120, h: 120, assetPath: '/assets/structures/v2/housing.png', offsetX: 0, offsetY: 0, scale: 1.2 },
    mina_metal:         { x: 730, y: 505, w: 140, h: 140, assetPath: '/assets/structures/v2/mine.png', offsetX: 0, offsetY: 0, scale: 1.3 },
    
    // MARGINALS
    muralha:            { x: 750, y: 55, w: 100, h: 100, assetPath: '', offsetX: 0, offsetY: 0 },
    parlamento:         { x: 400, y: 560, w: 100, h: 100, assetPath: '', offsetX: 0, offsetY: 0 }
};
