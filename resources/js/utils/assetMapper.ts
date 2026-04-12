/**
 * resources/js/utils/assetMapper.ts
 * Utilitário de mapeamento e fallback de ativos visuais.
 */

export const getBuildingAsset = (type: string, level: number = 1): string => {
    if (!type) return '/assets/placeholders/building_unknown.svg';
    const t = type.toLowerCase();
    
    // Lista de edifícios que ainda dependem de placeholders
    const placeholders = ['parlamento', 'factory', 'solar'];
    
    if (placeholders.includes(t)) {
        return `/assets/placeholders/building_${t}.svg`;
    }
    
    // Caminho padrão para edifícios com arte final
    return `/images/edificios/${t}/lvl_${level}.png`;
};

export const getUnitAsset = (type: string): string => {
    if (!type) return '/assets/placeholders/unit_unknown.svg';
    const t = type.toLowerCase();
    
    // Lista de unidades que ainda dependem de placeholders
    const placeholders = ['politico', 'helicoptero_ataque', 'drone_recon'];
    
    if (placeholders.includes(t)) {
        return `/assets/placeholders/unit_${t}.svg`;
    }
    
    // Caminho padrão para unidades com arte final
    return `/images/unidades/${t}.png`;
};

export const getResourceAsset = (type: string): string => {
    if (!type) return '/assets/placeholders/resource_unknown.svg';
    const t = type.toLowerCase();
    return `/assets/placeholders/resource_${t}.svg` || `/images/recursos/${t}.png`;
};
