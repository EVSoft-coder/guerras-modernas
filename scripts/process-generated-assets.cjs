const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const RAW_DIR = 'C:/Users/fotoa/.gemini/antigravity/brain/458321b9-874d-4f33-a844-8d07b5796ae7';
const TARGET_DIR = path.join(__dirname, '../public/assets/buildings');

const ASSETS_TO_PROCESS = [
  { raw: 'hq_v1_raw_1776689559452.png', target: 'hq_v1.png', h: 260 },
  { raw: 'fabrica_v1_raw_1776689575380.png', target: 'fabrica_v1.png', h: 180 },
  { raw: 'quartel_v1_raw_1776689590570.png', target: 'quartel_v1.png', h: 180 },
  { raw: 'radar_v1_raw_1776689811348.png', target: 'radar_v1.png', h: 120 },
  { raw: 'energia_v1_raw_1776689823889.png', target: 'energia_v1.png', h: 140 },
  { raw: 'pesquisa_v1_raw_1776689838781.png', target: 'pesquisa_v1.png', h: 140 },
  { raw: 'aerodromo_v1_raw_1776689852038.png', target: 'aerodromo_v1.png', h: 200 },
  { raw: 'muralha_v1_raw_1776689865723.png', target: 'muralha_v1.png', h: 100 },
];


async function processAsset(asset) {
  const inputPath = path.join(RAW_DIR, asset.raw);
  const outputPath = path.join(TARGET_DIR, asset.target);

  console.log(`📡 Processando: ${asset.raw} -> ${asset.target}`);

  try {
    // 1. Carregar e remover fundo branco (se existir)
    // Usamos um threshold para garantir que reflexos leves no metal não fiquem transparentes
    const image = sharp(inputPath);
    
    // 2. Trim and Ensure Alpha
    const trimmedBuffer = await image.trim().toBuffer();
    const { data, info } = await sharp(trimmedBuffer)
      .ensureAlpha() // GARANTIR 4 CANAIS
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // 3. Process Pixels (White to Alpha)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      // Se for quase branco puro (> 240)
      if (r > 240 && g > 240 && b > 240) {
        data[i+3] = 0; // Alpha Transparente
      }
    }

    // 4. Save Final Asset
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .resize({ height: asset.h, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }})
      .png()
      .toFile(outputPath);

    console.log(`✅ Sucesso: ${asset.target} guardado.`);

  } catch (err) {
    console.error(`❌ Erro em ${asset.target}:`, err);
  }
}

async function run() {
  await fs.ensureDir(TARGET_DIR);
  for (const asset of ASSETS_TO_PROCESS) {
    await processAsset(asset);
  }
}

run();
