export interface BuildingLayout {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    anchor: 'center' | 'bottom';
    assetName: string;
    rotation?: number;
    transparency?: {
        targetColor?: { r: number, g: number, b: number };
        tolerance?: number;
    };
}

export const REFERENCE_WIDTH = 800;
export const REFERENCE_HEIGHT = 600;

export const BUILDING_LAYOUT: Record<string, BuildingLayout & { id: string }> = {
    "central_energia": {
        "x": 485,
        "y": 140,
        "id": "ENERGY",
        "w": 67,
        "h": 67,
        "anchor": "center",
        "assetName": "energia_v1.png",
        "rotation": -1
    },
    "radar_estrategico": {
        "x": 416,
        "y": 251,
        "id": "RADAR",
        "w": 80,
        "h": 90,
        "anchor": "center",
        "assetName": "radar_v1.png",
        "rotation": 3
    },
    "centro_pesquisa": {
        "x": 619,
        "y": 223,
        "id": "RESEARCH",
        "w": 76,
        "h": 76,
        "anchor": "center",
        "assetName": "pesquisa_v1.png",
        "rotation": -3
    },
    "fabrica_municoes": {
        "x": 232,
        "y": 344,
        "id": "FACTORY",
        "w": 78,
        "h": 78,
        "anchor": "center",
        "assetName": "fabrica_v1.png"
    },
    "hq": {
        "x": 413,
        "y": 285,
        "id": "HQ",
        "w": 120,
        "h": 120,
        "anchor": "center",
        "assetName": "hq_elite_v1.png",
        "rotation": 0
    },
    "quartel": {
        "x": 650,
        "y": 301,
        "id": "BARRACKS",
        "w": 78,
        "h": 78,
        "anchor": "center",
        "assetName": "quartel_v1.png"
    },
    "aerodromo": {
        "x": 468,
        "y": 417,
        "id": "AIRPORT",
        "w": 98,
        "h": 98,
        "anchor": "center",
        "assetName": "aerodromo_v1.png"
    },
    "muralha": {
        "x": 535,
        "y": 470,
        "id": "WALL",
        "w": 98,
        "h": 98,
        "anchor": "center",
        "assetName": "muralha_v1.png",
        "rotation": -6
    },
    "mina_metal": {
        "x": 174,
        "y": 187,
        "id": "METAL_MINE",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "mina_metal_v1.png"
    },
    "mina_suprimentos": {
        "x": 279,
        "y": 324,
        "id": "SUPPLY_MINE",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "mina_suprimentos_v1.png"
    },
    "refinaria": {
        "x": 531,
        "y": 181,
        "id": "REFINERY",
        "w": 90,
        "h": 90,
        "anchor": "center",
        "assetName": "refinaria_v1.png"
    },
    "housing": {
        "x": 440,
        "y": 326,
        "id": "HOUSING",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "housing_v1.png"
    },
    "posto_recrutamento": {
        "x": 364,
        "y": 176,
        "id": "RECRUITMENT",
        "w": 90,
        "h": 90,
        "anchor": "center",
        "assetName": "quartel_v1.png"
    }
};

/**
 * BUILDING_OFFSETS V96 — DEPRECATED (Utilize BUILDING_LAYOUT para novos calibradores)
 */
export const BUILDING_OFFSETS: Record<string, { x: number, y: number, rotation?: number }> = {
    HQ:        { x: 0, y: 0 },
    RADAR:     { x: 0, y: 0 },
    ENERGY:    { x: 0, y: 0 },
    RESEARCH:  { x: 0, y: 0 },
    FACTORY:   { x: 0, y: 0 },
    BARRACKS:  { x: 0, y: 0 },
    AIRPORT:   { x: 0, y: 0 },
    WALL:      { x: 0, y: 0 },
};
