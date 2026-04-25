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
        "x": 499,
        "y": 184,
        "id": "ENERGY",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "energia_v1.png",
        "rotation": -1
    },
    "radar_estrategico": {
        "x": 267,
        "y": 208,
        "id": "RADAR",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "radar_v1.png",
        "rotation": -2
    },
    "centro_pesquisa": {
        "x": 510,
        "y": 256,
        "id": "RESEARCH",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "pesquisa_v1.png",
        "rotation": -3
    },
    "fabrica_municoes": {
        "x": 228,
        "y": 267,
        "id": "FACTORY",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "fabrica_v1.png"
    },
    "hq": {
        "x": 379,
        "y": 261,
        "id": "HQ",
        "w": 130,
        "h": 130,
        "anchor": "center",
        "assetName": "hq_elite_v1.png",
        "rotation": 0,
        "transparency": {
            "targetColor": {
                "r": 58,
                "g": 59,
                "b": 58
            },
            "tolerance": 50
        }
    },
    "quartel": {
        "x": 498,
        "y": 377,
        "id": "BARRACKS",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "quartel_v1.png",
        "rotation": 2
    },
    "aerodromo": {
        "x": 556,
        "y": 331,
        "id": "AIRPORT",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "aerodromo_v1.png"
    },
    "muralha": {
        "x": 638,
        "y": 416,
        "id": "WALL",
        "w": 97,
        "h": 99,
        "anchor": "center",
        "assetName": "muralha_v1.png",
        "rotation": -8
    },
    "mina_metal": {
        "x": 111,
        "y": 248,
        "id": "METAL_MINE",
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "mina_metal_v1.png"
    },
    "mina_suprimentos": {
        "x": 207,
        "y": 324,
        "id": "SUPPLY_MINE",
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "mina_suprimentos_v1.png",
        "rotation": -1
    },
    "refinaria": {
        "x": 609,
        "y": 233,
        "id": "REFINERY",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "refinaria_v1.png"
    },
    "housing": {
        "x": 339,
        "y": 381,
        "id": "HOUSING",
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "housing_v1.png"
    },
    "posto_recrutamento": {
        "x": 379,
        "y": 150,
        "id": "RECRUITMENT",
        "w": 80,
        "h": 80,
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
