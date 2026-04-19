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

/**
 * LAYOUT PANZER V38 — GRELHA DE 12 PONTOS
 * Todos os edifícios dentro da zona útil (X: 100-700).
 * Slots dispostos para máxima visibilidade e zero sobreposição.
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // FILA SUPERIOR (Logística e Pesquisa)
    radar_estrategico:  { x: 150, y: 120, w: 100, h: 100, anchor: 'center', assetName: 'radar_estrategico.png' },
    central_energia:    { x: 320, y: 100, w: 90, h: 90, anchor: 'center', assetName: 'central_energia.png' },
    centro_pesquisa:    { x: 480, y: 100, w: 100, h: 100, anchor: 'center', assetName: 'centro_pesquisa.png' },
    housing:            { x: 650, y: 120, w: 90, h: 90, anchor: 'center', assetName: 'housing.png' },

    // FILA CENTRAL (Comando e Recursos)
    qg:                 { x: 400, y: 280, w: 220, h: 220, anchor: 'center', assetName: 'qg.png' },
    fabrica_municoes:   { x: 150, y: 300, w: 110, h: 110, anchor: 'center', assetName: 'fabrica_municoes.png' },
    quartel:            { x: 650, y: 300, w: 110, h: 110, anchor: 'center', assetName: 'quartel.png' },

    // FILA INFERIOR (Operações e Defesa)
    mina_suprimentos:   { x: 150, y: 480, w: 110, h: 110, anchor: 'center', assetName: 'mine.png' },
    refinaria:          { x: 300, y: 500, w: 110, h: 110, anchor: 'center', assetName: 'fabrica_municoes.png' },
    aerodromo:          { x: 500, y: 500, w: 130, h: 130, anchor: 'center', assetName: 'aerodromo.png' },
    muralha:            { x: 680, y: 480, w: 200, h: 100, anchor: 'center', assetName: 'muralha.png' },
};
