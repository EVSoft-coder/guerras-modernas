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

    // Normalização para diretório real /assets/buildings/
    let assetBase = t;
    if (t === 'mina_metal') assetBase = 'mina_metal';
    if (t === 'central_energia') assetBase = 'energia';
    if (t === 'fabrica_municoes') assetBase = 'fabrica';
    if (t === 'centro_pesquisa') assetBase = 'pesquisa';
    if (t === 'radar_estrategico') assetBase = 'radar';
    if (t === 'quartel') assetBase = 'quartel';
    if (t === 'muralha') assetBase = 'muralha';
    if (t === 'mina_suprimentos') assetBase = 'mina_suprimentos';
    if (t === 'refinaria') assetBase = 'refinaria';

    // HQ tem hq_v1, hq_v2 e hq_elite_v1
    if (t === 'hq') {
        if (level >= 2) return `/assets/buildings/hq_v2.png`;
        return `/assets/buildings/hq_elite_v1.png`;
    }

    // Outros edifícios que têm v2 (ex: muralha, quartel, fabrica)
    const hasV2 = ['muralha', 'quartel', 'fabrica'].includes(t);
    if (hasV2 && level >= 2) return `/assets/buildings/${assetBase}_v2.png`;

    // Fallback padrão para v1 no diretório de assets
    return `/assets/buildings/${assetBase}_v1.png`;
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
