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
        "x": 502,
        "y": 184,
        "id": "ENERGY",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "energia_v1.png",
        "rotation": -1
    },
    "radar_estrategico": {
        "x": 262,
        "y": 201,
        "id": "RADAR",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "radar_v1.png",
        "rotation": -2
    },
    "centro_pesquisa": {
        "x": 503,
        "y": 249,
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
        "x": 383,
        "y": 256,
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
            "tolerance": 49
        }
    },
    "quartel": {
        "x": 492,
        "y": 378,
        "id": "BARRACKS",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "quartel_v1.png",
        "rotation": 2
    },
    "aerodromo": {
        "x": 589,
        "y": 319,
        "id": "AIRPORT",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "aerodromo_v1.png",
        "transparency": {
            "targetColor": {
                "r": 69,
                "g": 59,
                "b": 49
            },
            "tolerance": 43
        }
    },
    "muralha": {
        "x": 652,
        "y": 416,
        "id": "WALL",
        "w": 88,
        "h": 88,
        "anchor": "center",
        "assetName": "muralha_v1.png",
        "rotation": -8
    },
    "mina_metal": {
        "x": 103,
        "y": 254,
        "id": "METAL_MINE",
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "mina_metal_v1.png"
    },
    "mina_suprimentos": {
        "x": 202,
        "y": 326,
        "id": "SUPPLY_MINE",
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "mina_suprimentos_v1.png",
        "rotation": -1
    },
    "refinaria": {
        "x": 619,
        "y": 237,
        "id": "REFINERY",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "refinaria_v1.png"
    },
    "housing": {
        "x": 333,
        "y": 386,
        "id": "HOUSING",
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "housing_v1.png"
    },
    "posto_recrutamento": {
        "x": 388,
        "y": 145,
        "id": "RECRUITMENT",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "recrutamento_v1.png"
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
