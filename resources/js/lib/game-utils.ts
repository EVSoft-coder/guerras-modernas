/**
 * UtilitÃ¡rios TÃ¡ticos de Jogo (Refactored to match Domain Layer)
 */
 
/**
 * Determina o nÃ­vel visual de um edifÃ­cio baseado no seu progresso.
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
 * Calcula o custo de um edifÃ­cio para o prÃ³ximo nÃ­vel.
 * FÃ“RMULA DE DOMÃNIO: BaseValue * (1 + (CurrentLevel * Scaling))
 */
export const calculateBuildingCost = (baseAmount: number, currentLevel: number, scaling: number = 1.5): number => {
    return Math.floor(baseAmount * (1 + (currentLevel * scaling)));
};
 
/**
 * Calcula o tempo de construÃ§Ã£o em segundos.
 * FÃ“RMULA DE DOMÃNIO: (TimeBase * (1 + (CurrentLevel * 0.5))) / Speed
 */
export const calculateConstructionTime = (timeBase: number, currentLevel: number, speed: number = 1): number => {
    const time = (timeBase * (1 + (currentLevel * 0.5))) / speed;
    return Math.max(5, Math.floor(time));
};
 
/**
 * Calcula a produÃ§Ã£o por hora de um edifÃ­cio de recursos.
 * FÃ“RMULA DE DOMÃNIO: (BaseProd * speed) * (1 + (nivel * scaling))
 */
export const calculateResourceProduction = (baseProd: number, level: number, speed: number = 1, scaling: number = 1.5): number => {
    return Math.floor((baseProd * speed) * (1 + (level * scaling)));
};
/**
 * Limpa e converte valores de recursos para nÃºmeros puros para comparaÃ§Ã£o.
 * Ãštil quando o backend envia valores formatados (string).
 */
export const parseResourceValue = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        // Remove separadores de milhar (pontos ou vÃ­rgulas)
        return parseFloat(val.replace(/[^\d.-]/g, '')) || 0;
    }
    return 0;
};
