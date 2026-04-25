/**
 * Utilitários Táticos de Jogo (Fase 14 — Balanceamento Profissional)
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
 * Calcula o custo de um edifício para o próximo nível (Exponencial).
 * FÓRMULA: Base * (1.6 ^ LevelAtual)
 */
export const calculateBuildingCost = (baseAmount: number, currentLevel: number): number => {
    return Math.floor(baseAmount * Math.pow(1.6, currentLevel));
};

/**
 * Calcula o tempo de construção em segundos (Exponencial).
 * FÓRMULA: Base * (1.1 ^ LevelAtual)
 */
export const calculateConstructionTime = (timeBase: number, currentLevel: number): number => {
    const time = timeBase * Math.pow(1.1, currentLevel);
    return Math.max(5, Math.floor(time));
};

/**
 * Calcula a produção por hora de um edifício de recursos (Exponencial).
 * FÓRMULA: base * (level ^ 1.2)
 */
export const calculateResourceProduction = (baseProd: number, level: number): number => {
    if (level <= 0) return 0;
    return Math.floor(baseProd * Math.pow(level, 1.2));
};

/**
 * Limpa e converte valores de recursos para números puros para comparação.
 * Útil quando o backend envia valores formatados (string).
 */
export const parseResourceValue = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        // Remove separadores de milhar (pontos ou vírgulas)
        return parseFloat(val.replace(/[^\d.-]/g, '')) || 0;
    }
    return 0;
};
