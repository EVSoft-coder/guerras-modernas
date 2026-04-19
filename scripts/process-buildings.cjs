const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../resources/assets/buildings_raw');
const OUTPUT_DIR = path.join(__dirname, '../public/images/buildings');

// Metas de altura conforme FASE 2
const TARGET_SIZES = {
  qg: 320,
  quartel: 180,
  fabrica_municoes: 180,
  central_energia: 140,
  centro_pesquisa: 140,
  radar_estrategico: 120,
  aerodromo: 200,
  muralha: 100,
};

async function processImage(file) {
  const name = path.parse(file).name;
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
  
  // Altura Alvo (H)
  const targetH = TARGET_SIZES[name] || 150;

  console.log(`[PROCESS] 🛡️ Purificando ${name} -> Alvo H: ${targetH}px`);

  try {
    // 1. CARREGAR E PREPARAR CANAL ALPHA
    let pipeline = sharp(inputPath).ensureAlpha();
    
    // Obter buffer bruto para manipulação cromática agressiva
    const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
    
    // 2. ERRADICAÇÃO DE FUNDO E XADREZ (Threshold Avançado)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      const saturation = max === 0 ? 0 : delta / max;

      // REGRA DE OURO V41: 
      // Se for neutro (cinza/branco) e estiver fora de um certo threshold de cor militar
      // Cores militares tendem a ter saturação > 0.1 (azul, verde, bege)
      // O xadrez de fundo é SEMPRE cinza neutro (saturation < 0.05)
      if (saturation < 0.08) {
          if (max > 130 || max < 40) { // Cinzas claros ou pretos de fundo
              data[i+3] = 0; // Transparência Total
          }
      }
    }

    // 3. RECONSTRUIR E FINALIZAR (Trim + Resize)
    await sharp(data, { raw: info })
      .trim() // REMOVE BORDAS VAZIAS
      .resize(null, targetH, { // Força a altura H mantendo o rácio
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(outputPath);

    console.log(`[SUCCESS] ✅ ${name} purificado e redimensionado.`);
  } catch (err) {
    console.error(`[ERROR] ❌ Erro em ${name}: ${err.message}`);
  }
}

async function start() {
  await fs.ensureDir(OUTPUT_DIR);
  const files = (await fs.readdir(INPUT_DIR)).filter(f => ['.png', '.jpg', '.jpeg', '.webp'].then?.includes ? f.endsWith('.png') : true);
  
  // Limpar diretório de saída para evitar resíduos
  await fs.emptyDir(OUTPUT_DIR);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        await processImage(file);
    }
  }
  
  console.log("🏁 Operação Purificação V41 concluída.");
}

start();
