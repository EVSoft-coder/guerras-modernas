/**
 * resources/js/utils/assetMapper.ts
 * Utilitário de mapeamento e fallback de ativos visuais.
 */

export const getBuildingAsset = (type: string, level: number | 'blueprint' = 1): string => {
    if (!type) return '/assets/placeholders/building_unknown.svg';
    const t = type.toLowerCase();
    
    if (level === 'blueprint') {
        return "/images/building_blueprint_placeholder.png";
    }

    // Normalização de nomes para pastas de assets reais
    let assetFolder = t;
    if (t === 'mina_metal') assetFolder = 'factory';
    if (t === 'central_energia') assetFolder = 'solar';
    
    // Caminho padrão para edifícios com arte final
    return `/images/edificios/${assetFolder}/lvl_${level}.png`;
};

export const getUnitAsset = (type: string): string => {
    if (!type) return '/assets/placeholders/unit_unknown.svg';
    
    // Normalizar nome: ultra-robust slugify
    const t = type.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9]/g, '-')                     // Substitui tudo o que não é letra/número por hífen
        .replace(/-+/g, '-')                            // Remove hífens duplicados
        .replace(/^-|-$/g, '');                         // Remove hífens no início e fim
    
    // Caminho padrão para unidades com arte final
    return `/images/unidades/${t}.png`;
};

export const getResourceAsset = (type: string): string => {
    if (!type) return '/assets/placeholders/resource_unknown.svg';
    const t = type.toLowerCase();
    return `/assets/placeholders/resource_${t}.svg` || `/images/recursos/${t}.png`;
};
