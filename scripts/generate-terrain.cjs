const sharp = require('sharp');
const path = require('path');

// CONFIGURAÇÃO PANZER V38 (Sincronizada com buildingLayout.ts)
const SLOTS = [
    { x: 150, y: 120, r: 60 }, { x: 320, y: 100, r: 55 }, { x: 480, y: 100, r: 55 }, { x: 650, y: 120, r: 60 },
    { x: 400, y: 280, r: 120 }, { x: 150, y: 300, r: 65 }, { x: 650, y: 300, r: 65 },
    { x: 150, y: 480, r: 65 }, { x: 300, y: 500, r: 65 }, { x: 500, y: 500, r: 75 }, { x: 680, y: 480, r: 80 }
];

async function generateTerrain() {
    console.log("🏗️  Iniciando Composição de Terreno V16 (Panzer Grid)...");

    const terrainWidth = 800;
    const terrainHeight = 600;

    // Criar um Pad de Betão com efeito 3D Realista
    const createPad = (size) => {
        const h = size * 0.6;
        const svg = `
            <svg width="${size}" height="${h}" viewBox="0 0 ${size} ${h}">
                <!-- Sombra do Pad -->
                <ellipse cx="${size / 2}" cy="${h / 2 + 4}" rx="${size / 2}" ry="${h / 2}" fill="rgba(0,0,0,0.4)" />
                <!-- Base de Betão -->
                <ellipse cx="${size / 2}" cy="${h / 2}" rx="${size / 2 - 2}" ry="${h / 2 - 2}" 
                    fill="#3a3d41" 
                    stroke="#555" 
                    stroke-width="1.5" />
                <!-- Borda de luz (3D) -->
                <ellipse cx="${size / 2}" cy="${h / 2 - 1}" rx="${size / 2 - 4}" ry="${h / 2 - 4}" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.08)" 
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
            .modulate({ saturation: 0.7, brightness: 0.9 }) // Desaturar areia para destacar betão
            .composite(composites)
            .png()
            .toFile(path.join(__dirname, '../public/images/village/terrain_v16.png'));

        console.log("✅ Terreno V16 gerado com sucesso.");
    } catch (err) {
        console.error("❌ Erro:", err);
    }
}

generateTerrain();
