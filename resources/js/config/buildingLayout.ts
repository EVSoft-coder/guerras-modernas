export interface BuildingLayout {
    x: number;      // Pixel X em relação a 800px
    y: number;      // Pixel Y em relação a 600px
    w: number;      // Largura base em pixels
    h: number;      // Altura base em pixels
    zIndex: number;
    assetPath: string;
    anchor?: 'center' | 'bottom';
}

export const REFERENCE_WIDTH = 800;
export const REFERENCE_HEIGHT = 600;

export const BUILDING_LAYOUT_CONFIG: Record<string, BuildingLayout> = {
    qg: {
        x: 430,
        y: 280,
        w: 240,
        h: 240,
        zIndex: 30,
        assetPath: '/assets/structures/v2/hq.png',
        anchor: 'center'
    },
    central_energia: {
        x: 400,
        y: 60,
        w: 110,
        h: 110,
        zIndex: 10,
        assetPath: '/assets/structures/v2/energy.png',
        anchor: 'center'
    },
    mina_suprimentos: {
        x: 120,
        y: 110,
        w: 110,
        h: 110,
        zIndex: 11,
        assetPath: '/assets/structures/v2/mine.png',
        anchor: 'center'
    },
    mina_metal: {
        x: 680,
        y: 480,
        w: 120,
        h: 120,
        zIndex: 45,
        assetPath: '/assets/structures/v2/mine.png',
        anchor: 'center'
    },
    radar_estrategico: {
        x: 270,
        y: 80,
        w: 90,
        h: 90,
        zIndex: 12,
        assetPath: '/assets/structures/v2/radar.png',
        anchor: 'center'
    },
    centro_pesquisa: {
        x: 640,
        y: 130,
        w: 120,
        h: 120,
        zIndex: 13,
        assetPath: '/assets/structures/v2/research.png',
        anchor: 'center'
    },
    quartel: {
        x: 200,
        y: 220,
        w: 140,
        h: 140,
        zIndex: 20,
        assetPath: '/assets/structures/v2/barracks.png',
        anchor: 'center'
    },
    fabrica_municoes: {
        x: 140,
        y: 450,
        w: 160,
        h: 160,
        zIndex: 40,
        assetPath: '/assets/structures/v2/factory.png',
        anchor: 'center'
    },
    refinaria: {
        x: 720,
        y: 210,
        w: 110,
        h: 110,
        zIndex: 21,
        assetPath: '/assets/structures/v2/factory.png',
        anchor: 'center'
    },
    aerodromo: {
        x: 400,
        y: 500,
        w: 220,
        h: 220,
        zIndex: 42,
        assetPath: '/assets/structures/v2/aerodrome.png',
        anchor: 'center'
    },
    housing: {
        x: 210,
        y: 330,
        w: 100,
        h: 100,
        zIndex: 25,
        assetPath: '/assets/structures/v2/housing.png',
        anchor: 'center'
    },
    posto_recrutamento: {
        x: 640,
        y: 400,
        w: 100,
        h: 100,
        zIndex: 43,
        assetPath: '/assets/structures/v2/housing.png',
        anchor: 'center'
    },
    muralha: {
        x: 740,
        y: 40,
        w: 80,
        h: 80,
        zIndex: 5,
        assetPath: '',
        anchor: 'center'
    },
    parlamento: {
        x: 400,
        y: 550,
        w: 90,
        h: 90,
        zIndex: 50,
        assetPath: '',
        anchor: 'center'
    }
};
