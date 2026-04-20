const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const RAW_DIR = 'C:/Users/fotoa/.gemini/antigravity/brain/458321b9-874d-4f33-a844-8d07b5796ae7';
const TARGET_DIR = path.join(__dirname, '../public/assets/buildings');

/**
 * ATIVOS V2 (NO GROUND / HIGH SCALE CONTROL)
 */
const ASSETS_TO_PROCESS = [
  { raw: 'hq_v2_alpha_1776690112472.png', target: 'hq_v2.png', h: 160 },
  { raw: 'fabrica_v2_alpha_retry_1776690170427.png', target: 'fabrica_v2.png', h: 110 },
  { raw: 'quartel_v2_alpha_retry_1776690183544.png', target: 'quartel_v2.png', h: 110 },
  // Manter os outros temporariamente ou processar com escala menor
  { raw: 'radar_v1_raw_1776689811348.png', target: 'radar_v1.png', h: 90 },
  { raw: 'energia_v1_raw_1776689823889.png', target: 'energia_v1.png', h: 90 },
  { raw: 'pesquisa_v1_raw_1776689838781.png', target: 'pesquisa_v1.png', h: 90 },
  { raw: 'aerodromo_v1_raw_1776689852038.png', target: 'aerodromo_v1.png', h: 120 },
  { raw: 'muralha_v1_raw_1776689865723.png', target: 'muralha_v1.png', h: 80 },
];

async function processAsset(asset) {
  const inputPath = path.join(RAW_DIR, asset.raw);
  const outputPath = path.join(TARGET_DIR, asset.target);

  console.log(`📡 Processando V2: ${asset.raw} -> ${asset.target}`);

  try {
    const image = sharp(inputPath);
    
    // 1. Trim agressivo (Remove margens e fundo branco se o sharp conseguir detectar a bounding box)
    const trimmedBuffer = await image.trim().toBuffer();
    const { data, info } = await sharp(trimmedBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // 2. Remoção de Fundo Branco Agressiva (Threshold 230 para limpar halos)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      // Se for quase branco ou muito claro (fundo típico de IA)
      if (r > 230 && g > 230 && b > 230) {
        data[i+3] = 0; // Transparência Total
      }
    }

    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .resize({ height: asset.h, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }})
      .png()
      .toFile(outputPath);

    console.log(`✅ Sucesso V2: ${asset.target}.`);
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
