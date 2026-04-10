/**
 * Utilitários Táticos de Jogo
 */

/**
 * Determina o nível visual de um edifício baseado no seu progresso.
 */
export const getEvolutionLevelAsset = (lvl: number): number => {
    if (lvl >= 6) return 6;
    if (lvl >= 5) return 5;
    if (lvl >= 4) return 4;
    if (lvl >= 3) return 3;
    if (lvl >= 2) return 2;
    return 1;
};

/**
 * Calcula o custo de um edifício para o próximo nível.
 * Fórmula: floor(baseAmount * pow(nivelAlvo, scaling))
 */
export const calculateBuildingCost = (baseAmount: number, targetLevel: number, scaling: number = 1.5): number => {
    return Math.floor(baseAmount * Math.pow(targetLevel, scaling));
};

/**
 * Calcula o tempo de construção em segundos.
 * Fórmula: (timeBase * nivelAlvo) / speed
 */
export const calculateConstructionTime = (timeBase: number, targetLevel: number, speed: number = 1): number => {
    const time = (timeBase * targetLevel) / speed;
    return Math.max(5, Math.floor(time));
};

/**
 * Calcula a produção por hora de um edifício de recursos.
 * Fórmula: (baseProd * speed) * (1 + (nivel * scaling))
 */
export const calculateResourceProduction = (baseProd: number, level: number, speed: number = 1, scaling: number = 1.5): number => {
    return Math.floor((baseProd * speed) * (1 + (level * scaling)));
};
