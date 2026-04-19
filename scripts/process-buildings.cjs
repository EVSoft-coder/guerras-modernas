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

const DEFAULT_SIZE = 100;

async function processImage(file) {
  const name = path.parse(file).name;
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, `${name}.png`);

  const size = TARGET_SIZES[name] || DEFAULT_SIZE;

  console.log(`[PROCESS] 🏗️  ${name} -> Purificando Fake Transparency...`);

  try {
    let pipeline = sharp(inputPath).ensureAlpha();

    const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      // 1. REMOVER FUNDO PRETO
      if (r < 25 && g < 25 && b < 25) {
        data[i+3] = 0; 
      }
      
      // 2. REMOVER FALSO XADREZ (Cinza 204 e Branco 255)
      // Detetamos o padrão típico de "Fake Transparent PNG"
      const isCheckerGrey = (r === 204 && g === 204 && b === 204);
      const isCheckerWhite = (r === 255 && g === 255 && b === 255);
      
      if (isCheckerGrey || isCheckerWhite) {
          // Apenas removemos se estivermos numa zona provável de fundo 
          // (ou simplesmente removemos tudo o que for essa cor exata, já que são ativos militares cinza-escuro/metálico)
          data[i+3] = 0;
      }
    }

    await sharp(data, { raw: info })
      .trim()
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log(`[SUCCESS] ✅ ${name} purificado.`);
  } catch (err) {
    console.error(`[ERROR] ❌ Erro ao processar ${name}:`, err.message);
  }
}

async function start() {
  await fs.ensureDir(OUTPUT_DIR);
  const files = (await fs.readdir(INPUT_DIR)).filter(f => 
    ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(f).toLowerCase())
  );
  
  for (const file of files) {
    await processImage(file);
  }
  console.log(`[DONE] 🏆 Ativos limpos com sucesso.`);
}

start();
