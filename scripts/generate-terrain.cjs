const sharp = require('sharp');
const path = require('path');

// CONFIGURAÇÃO DE SLOTS (Sincronizada com buildingLayout.ts)
const SLOTS = [
    { x: 400, y: 260, r: 130 }, // QG
    { x: 230, y: 80,  r: 60  }, // Radar
    { x: 400, y: 70,  r: 50  }, // Energia
    { x: 570, y: 80,  r: 60  }, // Pesquisa
    { x: 150, y: 320, r: 60  }, // Fabrica
    { x: 650, y: 320, r: 60  }, // Quartel
    { x: 200, y: 530, r: 55  }, // Mina
    { x: 400, y: 530, r: 70  }, // Aerodromo
    { x: 720, y: 560, r: 60  }, // Muralha
];

async function generateTerrain() {
    console.log("🏗️  Iniciando Composição de Terreno V15...");

    const terrainWidth = 800;
    const terrainHeight = 600;

    // 1. Criar o Pad de Betão (Textura Única)
    const createPad = (size) => {
        const svg = `
            <svg width="${size}" height="${size * 0.6}" viewBox="0 0 ${size} ${size * 0.6}">
                <ellipse cx="${size / 2}" cy="${(size * 0.6) / 2}" rx="${size / 2 - 2}" ry="${(size * 0.6) / 2 - 2}" 
                    fill="rgba(40, 42, 45, 0.9)" 
                    stroke="rgba(255, 255, 255, 0.1)" 
                    stroke-width="2" />
                <ellipse cx="${size / 2}" cy="${(size * 0.6) / 2}" rx="${size / 3}" ry="${(size * 0.3) / 2}" 
                    fill="none" 
                    stroke="rgba(0, 0, 0, 0.2)" 
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
            .composite(composites)
            .png()
            .toFile(path.join(__dirname, '../public/images/village/terrain_v15.png'));

        console.log("✅ Terreno V15 gerado com sucesso em public/images/village/terrain_v15.png");
    } catch (err) {
        console.error("❌ Erro ao compor terreno:", err);
    }
}

generateTerrain();
