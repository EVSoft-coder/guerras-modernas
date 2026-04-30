/**
 * resources/js/config/buildingLayout.ts
 * Tactical Village Layout Configuration.
 * Optimized for 800x600 terrain backdrop.
 */

export interface BuildingLayout {
    x: number;
    y: number;
    w: number;
    h: number;
    assetName: string;
    rotation?: number;
    anchor?: 'center' | 'bottom';
    transparency?: {
        targetColor: { r: number, g: number, b: number };
        tolerance: number;
    };
    vividness?: number; // Saturação (1.0 = normal, >1.0 = mais vivo)
    brightness?: number; // Brilho (1.0 = normal)
}

export const REFERENCE_WIDTH = 800;
export const REFERENCE_HEIGHT = 600;

export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    "central_energia": {
        "x": 502,
        "y": 184,
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "energia_v1.png",
        "rotation": -1,
        "vividness": 1.8
    },
    "radar_estrategico": {
        "x": 262,
        "y": 201,
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "radar_v1.png",
        "rotation": -2,
        "vividness": 2.1
    },
    "centro_pesquisa": {
        "x": 503,
        "y": 249,
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "pesquisa_v1.png",
        "rotation": -3,
        "vividness": 2
    },
    "fabrica_municoes": {
        "x": 228,
        "y": 267,
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "fabrica_v1.png",
        "vividness": 2
    },
    "hq": {
        "x": 383,
        "y": 256,
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
        },
        "vividness": 1.9
    },
    "quartel": {
        "x": 492,
        "y": 378,
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "quartel_v1.png",
        "rotation": 2
    },
    "aerodromo": {
        "x": 620,
        "y": 306,
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "aerodromo_v1.png",
        "transparency": {
            "targetColor": {
                "r": 45,
                "g": 57,
                "b": 67
            },
            "tolerance": 32
        },
        "vividness": 2.3
    },
    "muralha": {
        "x": 659,
        "y": 414,
        "w": 88,
        "h": 88,
        "anchor": "center",
        "assetName": "muralha_v1.png",
        "rotation": -8,
        "vividness": 1.8
    },
    "mina_metal": {
        "x": 99,
        "y": 259,
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "mina_metal_v1.png",
        "vividness": 2
    },
    "mina_suprimentos": {
        "x": 202,
        "y": 326,
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "mina_suprimentos_v1.png",
        "rotation": 2,
        "vividness": 1.4
    },
    "refinaria": {
        "x": 625,
        "y": 236,
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "refinaria_v1.png",
        "vividness": 1.9
    },
    "housing": {
        "x": 330,
        "y": 391,
        "w": 71,
        "h": 71,
        "anchor": "center",
        "assetName": "housing_v1.png",
        "vividness": 1.8
    },
    "posto_recrutamento": {
        "x": 388,
        "y": 145,
        "w": 80,
        "h": 80,
        "anchor": "center",
        "assetName": "recrutamento_v1.png"
    },
    "armazem": {
        "x": 396,
        "y": 413,
        "w": 66,
        "h": 66,
        "anchor": "center",
        "assetName": "armazem_v1.png",
        "transparency": {
            "targetColor": {
                "r": 33,
                "g": 56,
                "b": 81
            },
            "tolerance": 75
        },
        "vividness": 3,
        "brightness": 1.3
    },
    "mercado": {
        "x": 566,
        "y": 349,
        "w": 58,
        "h": 53,
        "anchor": "center",
        "assetName": "mercado_v1.png",
        "transparency": {
            "targetColor": {
                "r": 193,
                "g": 218,
                "b": 227
            },
            "tolerance": 90
        },
        "vividness": 2.7
    }
};
