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
        "x": 480,
        "y": 177,
        "id": "ENERGY",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "energia_v1.png",
        "rotation": -1
    },
    "radar_estrategico": {
        "x": 309,
        "y": 250,
        "id": "RADAR",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "radar_v1.png",
        "rotation": 3
    },
    "centro_pesquisa": {
        "x": 545,
        "y": 291,
        "id": "RESEARCH",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "pesquisa_v1.png",
        "rotation": -3
    },
    "fabrica_municoes": {
        "x": 219,
        "y": 276,
        "id": "FACTORY",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "fabrica_v1.png"
    },
    "hq": {
        "x": 370,
        "y": 270,
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
        "x": 493,
        "y": 364,
        "id": "BARRACKS",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "quartel_v1.png",
        "rotation": 2
    },
    "aerodromo": {
        "x": 468,
        "y": 347,
        "id": "AIRPORT",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "aerodromo_v1.png"
    },
    "muralha": {
        "x": 544,
        "y": 442,
        "id": "WALL",
        "w": 97,
        "h": 99,
        "anchor": "center",
        "assetName": "muralha_v1.png",
        "rotation": -6
    },
    "mina_metal": {
        "x": 128,
        "y": 223,
        "id": "METAL_MINE",
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "mina_metal_v1.png"
    },
    "mina_suprimentos": {
        "x": 225,
        "y": 326,
        "id": "SUPPLY_MINE",
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "mina_suprimentos_v1.png",
        "rotation": 8
    },
    "refinaria": {
        "x": 560,
        "y": 222,
        "id": "REFINERY",
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "refinaria_v1.png"
    },
    "housing": {
        "x": 359,
        "y": 358,
        "id": "HOUSING",
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "housing_v1.png"
    },
    "posto_recrutamento": {
        "x": 343,
        "y": 162,
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
