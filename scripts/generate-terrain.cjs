const sharp = require('sharp');
const path = require('path');

async function generateTerrain() {
    console.log("🏗️  Iniciando Geração de Terreno V21 (Naked Terrain)...");

    const terrainWidth = 800;
    const terrainHeight = 600;

    try {
        await sharp(path.join(__dirname, '../public/images/village/terrain_v13.png'))
            .resize(terrainWidth, terrainHeight)
            .median(3)
            .modulate({ brightness: 0.85, saturation: 0.6 })
            // SEM COMPOSIÇÃO DE PADS (Agora são dinâmicos)
            .png()
            .toFile(path.join(__dirname, '../public/images/village/terrain_v21.png'));

        console.log("✅ Terreno V21 (Naked) gerado com sucesso.");
    } catch (err) {
        console.error("❌ Erro:", err);
    }
}

generateTerrain();
