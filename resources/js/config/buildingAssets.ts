
export interface AssetConfig {
  width: number;
  height: number;
  anchor: 'bottom' | 'center';
}

export const BUILDING_ASSETS: Record<string, AssetConfig> = {
  hq: {
    width: 200,
    height: 200,
    anchor: 'bottom'
  },
  quartel: {
    width: 110,
    height: 110,
    anchor: 'bottom'
  },
  fabrica_municoes: {
    width: 110,
    height: 110,
    anchor: 'bottom'
  },
  central_energia: {
    width: 90,
    height: 90,
    anchor: 'bottom'
  },
  centro_pesquisa: {
    width: 90,
    height: 90,
    anchor: 'bottom'
  },
  radar_estrategico: {
    width: 90,
    height: 90,
    anchor: 'bottom'
  },
  aerodromo: {
    width: 120,
    height: 120,
    anchor: 'bottom'
  },
  muralha: {
    width: 260,
    height: 110,
    anchor: 'center'
  },
  mine: {
    width: 100,
    height: 100,
    anchor: 'bottom'
  },
  housing: {
    width: 110,
    height: 110,
    anchor: 'bottom'
  }
};
