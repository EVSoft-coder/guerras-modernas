export interface BuildingLayout {
    top: string;
    left: string;
    width: string;
    height: string;
    zIndex: number;
    assetPath: string;
}

export const BUILDING_LAYOUT_CONFIG: Record<string, BuildingLayout> = {
    qg: {
        top: '45%',
        left: '52%',
        width: '320px',
        height: '320px',
        zIndex: 30,
        assetPath: '/assets/structures/v2/hq.png'
    },
    central_energia: {
        top: '8%',
        left: '50%',
        width: '140px',
        height: '140px',
        zIndex: 10,
        assetPath: '/assets/structures/v2/energy.png'
    },
    mina_suprimentos: {
        top: '18%',
        left: '15%',
        width: '130px',
        height: '130px',
        zIndex: 11,
        assetPath: '/assets/structures/v2/mine.png'
    },
    mina_metal: {
        top: '82%',
        left: '85%',
        width: '140px',
        height: '140px',
        zIndex: 45,
        assetPath: '/assets/structures/v2/mine.png'
    },
    radar_estrategico: {
        top: '12%',
        left: '32%',
        width: '110px',
        height: '110px',
        zIndex: 12,
        assetPath: '/assets/structures/v2/radar.png'
    },
    centro_pesquisa: {
        top: '22%',
        left: '80%',
        width: '150px',
        height: '150px',
        zIndex: 13,
        assetPath: '/assets/structures/v2/research.png'
    },
    quartel: {
        top: '38%',
        left: '25%',
        width: '170px',
        height: '170px',
        zIndex: 20,
        assetPath: '/assets/structures/v2/barracks.png'
    },
    fabrica_municoes: {
        top: '72%',
        left: '15%',
        width: '200px',
        height: '200px',
        zIndex: 40,
        assetPath: '/assets/structures/v2/factory.png'
    },
    refinaria: {
        top: '35%',
        left: '92%',
        width: '140px',
        height: '140px',
        zIndex: 21,
        assetPath: '/assets/structures/v2/factory.png'
    },
    aerodromo: {
        top: '86%',
        left: '48%',
        width: '240px',
        height: '240px',
        zIndex: 42,
        assetPath: '/assets/structures/v2/aerodrome.png'
    },
    housing: {
        top: '55%',
        left: '24%',
        width: '120px',
        height: '120px',
        zIndex: 25,
        assetPath: '/assets/structures/v2/housing.png'
    },
    posto_recrutamento: {
        top: '68%',
        left: '80%',
        width: '120px',
        height: '120px',
        zIndex: 43,
        assetPath: '/assets/structures/v2/housing.png'
    },
    muralha: {
        top: '6%',
        left: '92%',
        width: '90px',
        height: '90px',
        zIndex: 5,
        assetPath: '' // Usar fallback se vazio
    },
    parlamento: {
        top: '92%',
        left: '50%',
        width: '110px',
        height: '110px',
        zIndex: 50,
        assetPath: ''
    }
};
