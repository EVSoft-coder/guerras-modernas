const sharp = require('sharp');
const path = require('path');

// CONFIGURAÇÃO PIXEL PRECISION V51
const SLOTS = [
    { x: 400, y: 300, r: 140 }, // HQ
    { x: 200, y: 140, r: 65 },  // Radar
    { x: 400, y: 120, r: 70 },  // Energia
    { x: 600, y: 140, r: 70 },  // Pesquisa
    { x: 220, y: 330, r: 85 },  // Fabrica
    { x: 580, y: 330, r: 85 },  // Quartel
    { x: 400, y: 480, r: 100 }, // Aerodromo
    { x: 400, y: 560, r: 120 }, // Muralha
];

async function generateTerrain() {
    console.log("🏗️  Iniciando Geração de Terreno V18 (Pixel Precision)...");

    const terrainWidth = 800;
    const terrainHeight = 600;

    const createPad = (size) => {
        const h = size * 0.6;
        const svg = `
            <svg width="${size}" height="${h}" viewBox="0 0 ${size} ${h}">
                <ellipse cx="${size / 2}" cy="${h / 2 + 3}" rx="${size / 2}" ry="${h / 2}" fill="rgba(0,0,0,0.25)" />
                <ellipse cx="${size / 2}" cy="${h / 2}" rx="${size / 2 - 2}" ry="${h / 2 - 2}" fill="#35383c" stroke="#444" stroke-width="1" />
                <ellipse cx="${size / 2}" cy="${h / 2 - 1}" rx="${size / 2 - 4}" ry="${h / 2 - 4}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
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
            .median(3)
            .modulate({ brightness: 0.85, saturation: 0.6 })
            .composite(composites)
            .png()
            .toFile(path.join(__dirname, '../public/images/village/terrain_v18.png'));

        console.log("✅ Terreno V18 (Pixel Precision) gerado com sucesso.");
    } catch (err) {
        console.error("❌ Erro:", err);
    }
}

generateTerrain();
