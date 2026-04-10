/**
 * Utilitários Táticos de Jogo
 */

/**
 * Determina o nível visual de um edifício baseado no seu progresso.
 * Escala padrão: 1, 2, 3, 4, 5, 6
 */
export const getEvolutionLevelAsset = (lvl: number): number => {
    if (lvl >= 6) return 6;
    if (lvl >= 5) return 5;
    if (lvl >= 4) return 4;
    if (lvl >= 3) return 3;
    if (lvl >= 2) return 2;
    return 1;
};
