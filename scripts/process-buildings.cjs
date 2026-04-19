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
  centro_pesquisa: 110,
  radar_estrategico: 110,
  aerodromo: 140,
  muralha: 260,
};

async function processImage(file) {
  const name = path.parse(file).name;
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
  const size = TARGET_SIZES[name] || 100;

  console.log(`[PROCESS] 🏗️  ${name} -> Erradicação de Fundo V32 (Perimetral)...`);

  try {
    let pipeline = sharp(inputPath).ensureAlpha();
    const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
    
    // 1. ANALISAR CANTO (0,0) PARA DETETAR COR DE FUNDO
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      const saturation = max === 0 ? 0 : delta / max;

      // REGRAS DE ERRADICAÇÃO (V32)
      // A) Se for a cor exata do canto superior esquerdo (Fundo Típico)
      if (Math.abs(r - bgR) < 3 && Math.abs(g - bgG) < 3 && Math.abs(b - bgB) < 3) {
          data[i+3] = 0;
          continue;
      }

      // B) Se for quase neutro (R=G=B) e claro (Xadrez branco/cinza)
      if (saturation < 0.05 && max > 120) {
          data[i+3] = 0;
          continue;
      }

      // C) Se for quase neutro e muito escuro (Xadrez cinza-escuro/preto)
      if (saturation < 0.05 && max < 50) {
          data[i+3] = 0;
          continue;
      }
      
      // D) Hard fix para o padrão Research (Cinzas variados)
      if (r > 180 && g > 180 && b > 180 && saturation < 0.03) {
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
