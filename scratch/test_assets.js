
// Test script for assetMapper logic
const type = "Tanque de Combate (MBT)";

function getUnitAssetTest(type) {
    if (!type) return '/assets/placeholders/unit_unknown.svg';
    
    // Normalizar nome: ultra-robust slugify
    const t = type.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9]/g, '-')                     // Substitui tudo o que não é letra/número por hífen
        .replace(/-+/g, '-')                            // Remove hífens duplicados
        .replace(/^-|-$/g, '');                         // Remove hífens no início e fim
    
    return `/images/unidades/${t}.png`;
}

console.log("Original:", type);
console.log("Result:", getUnitAssetTest(type));

const type2 = "Veículo leve (APC)";
console.log("Original 2:", type2);
console.log("Result 2:", getUnitAssetTest(type2));
