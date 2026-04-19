const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../resources/assets/buildings_raw');
const OUTPUT_DIR = path.join(__dirname, '../public/images/buildings');

const TARGET_SIZES = {
  qg: 260,
  quartel: 110,
  fabrica_municoes: 110,
  central_energia: 90,
  centro_pesquisa: 90,
  radar_estrategico: 110,
  aerodromo: 140,
  muralha: 260,
};

async function processImage(file) {
  const name = path.parse(file).name;
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
  const size = TARGET_SIZES[name] || 100;

  console.log(`[PROCESS] 🏗️  ${name} -> Purificação Agressiva (V29)...`);

  try {
    let pipeline = sharp(inputPath).ensureAlpha();
    const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      // ANÁLISE DE SATURAÇÃO (Eradicação de Xadrez)
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      const saturation = max === 0 ? 0 : delta / max;

      // 1. Remover se for quase preto 
      if (max < 40) {
        data[i+3] = 0; 
      }
      
      // 2. Remover se for quase cinza/branco (Xadrez)
      // Edifícios militares são cinzentos, mas o xadrez é muito "flat"
      if (saturation < 0.05 && max > 180) {
          data[i+3] = 0;
      }

      // 3. Remover cinzas médios suspeitos (Padrão 204)
      if (saturation < 0.02 && r > 190 && r < 210) {
          data[i+3] = 0;
      }
    }

    await sharp(data, { raw: info })
      .trim()
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }})
      .png()
      .toFile(outputPath);

    console.log(`[SUCCESS] ✅ ${name} limpo.`);
  } catch (err) {
    console.error(`[ERROR] ❌ ${name}:`, err.message);
  }
}

async function start() {
  await fs.ensureDir(OUTPUT_DIR);
  const files = (await fs.readdir(INPUT_DIR)).filter(f => ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(f).toLowerCase()));
  for (const file of files) await processImage(file);
}

start();
