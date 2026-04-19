const sharp = require('sharp');
const path = require('path');

// CONFIGURAÇÃO ABSOLUTA V43/V45
const SLOTS = [
    { x: 400, y: 300, r: 140 }, // HQ Mestre
    { x: 150, y: 350, r: 85 },  // Fabrica
    { x: 650, y: 350, r: 85 },  // Quartel
    { x: 150, y: 150, r: 65 },  // Radar
    { x: 400, y: 120, r: 70 },  // Energia
    { x: 650, y: 150, r: 70 },  // Pesquisa
    { x: 400, y: 500, r: 100 }, // Aerodromo
    { x: 400, y: 580, r: 120 }, // Muralha (Pad base)
];

async function generateTerrain() {
    console.log("🏗️  Iniciando Limpeza de Terreno V17 (Background Clean)...");

    const terrainWidth = 800;
    const terrainHeight = 600;

    // Criar Pad de Betão Suavizado V45
    const createPad = (size) => {
        const h = size * 0.6;
        const svg = `
            <svg width="${size}" height="${h}" viewBox="0 0 ${size} ${h}">
                <!-- Sombra Difusa (Suave) -->
                <ellipse cx="${size / 2}" cy="${h / 2 + 3}" rx="${size / 2}" ry="${h / 2}" fill="rgba(0,0,0,0.25)" />
                <!-- Base de Betão -->
                <ellipse cx="${size / 2}" cy="${h / 2}" rx="${size / 2 - 2}" ry="${h / 2 - 2}" 
                    fill="#35383c" 
                    stroke="#444" 
                    stroke-width="1" />
                <!-- Luz Superior -->
                <ellipse cx="${size / 2}" cy="${h / 2 - 1}" rx="${size / 2 - 4}" ry="${h / 2 - 4}" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.05)" 
                    stroke-width="1" />
            </svg>
        `;
        return Buffer.from(svg);
    };

    const composites = SLOTS.map(slot => ({
        input: createPad(slot.r * 2),
        top: Math.floor(slot.y - (slot.r * 0.6) / 2),
        left: Math.floor(slot.x - slot.r),
    }));

    try {
        await sharp(path.join(__dirname, '../public/images/village/terrain_v13.png'))
            .resize(terrainWidth, terrainHeight)
            // OPERAÇÃO CLEAN V45
            .median(3) // Reduz ruído de pedras pequenas e grão
            .modulate({ 
                brightness: 0.85, // Escurece ligeiramente para edifícios brilharem
                saturation: 0.6,  // Desatura areia
            })
            .composite(composites)
            .png()
            .toFile(path.join(__dirname, '../public/images/village/terrain_v17.png'));

        console.log("✅ Terreno V17 (Clean) gerado com sucesso.");
    } catch (err) {
        console.error("❌ Erro:", err);
    }
}

generateTerrain();
