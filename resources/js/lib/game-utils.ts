/**
 * Utilitários Táticos de Jogo (Refactored to match Domain Layer)
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
 * FÓRMULA DE DOMÍNIO: BaseValue * (1 + (CurrentLevel * Scaling))
 */
export const calculateBuildingCost = (baseAmount: number, currentLevel: number, scaling: number = 1.5): number => {
    return Math.floor(baseAmount * (1 + (currentLevel * scaling)));
};
 
/**
 * Calcula o tempo de construção em segundos.
 * FÓRMULA DE DOMÍNIO: (TimeBase * (1 + (CurrentLevel * 0.5))) / Speed
 */
export const calculateConstructionTime = (timeBase: number, currentLevel: number, speed: number = 1): number => {
    const time = (timeBase * (1 + (currentLevel * 0.5))) / speed;
    return Math.max(5, Math.floor(time));
};
 
/**
 * Calcula a produção por hora de um edifício de recursos.
 * FÓRMULA DE DOMÍNIO: (BaseProd * speed) * (1 + (nivel * scaling))
 */
export const calculateResourceProduction = (baseProd: number, level: number, speed: number = 1, scaling: number = 1.5): number => {
    return Math.floor((baseProd * speed) * (1 + (level * scaling)));
};
