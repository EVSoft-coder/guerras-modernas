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
 * LAYOUT DE ESTABILIZAÇÃO V50 — HQ ÚNICO
 * Apenas o Quartel-General é permitido no sistema até validação final.
 * Coordenada Absoluta: (400, 300)
 */
export const BUILDING_LAYOUT: Record<string, BuildingLayout> = {
    // 1. QUARTEL-GENERAL (HQ) - O ALICERCE
    qg: { x: 400, y: 300, w: 320, h: 320, anchor: 'center', assetName: 'qg.png' },
};
