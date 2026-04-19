const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../resources/assets/buildings_raw');
const OUTPUT_DIR = path.join(__dirname, '../public/images/buildings');

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
  
  const targetH = TARGET_SIZES[name] || 150;

  console.log(`[AUDIT] 🔍 Analisando ${name}...`);

  try {
    let pipeline = sharp(inputPath).ensureAlpha();
    const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
    
    let rejected = false;
    let checkerCount = 0;

    // 1. ALGORITMO DE PURGAÇÃO AGRESSIVA (V42)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      const a = data[i+3];
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      const saturation = max === 0 ? 0 : delta / max;

      // DETEÇÃO DE XADREZ (Cinza neutro repetitivo)
      if (saturation < 0.05) {
          // Se for cinza de "falso fundo"
          if ((max > 150 && max < 210) || max > 245) {
              data[i+3] = 0; // Mata o pixel
              checkerCount++;
          }
      }
    }

    // 2. TESTE DE REJEIÇÃO (Fase 3)
    // Se o script teve de remover DEMASIADOS pixels neutros claros em zonas onde deveria haver edifício,
    // ou se ainda restarem artefactos óbvios (analisando amostras da borda)
    if (checkerCount > (info.width * info.height * 0.8)) {
        console.warn(`[REJECTED] ❌ ${name}: Imagem identificada como lixo visual (apenas fundo/xadrez).`);
        return;
    }

    // 3. RECONSTRUÇÃO COM TRIM RIGOROSO
    await sharp(data, { raw: info })
      .trim()
      .resize(null, targetH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }})
      .png()
      .toFile(outputPath);

    console.log(`[SUCCESS] ✅ ${name} aprovado e purificado.`);
  } catch (err) {
    console.error(`[ERROR] ❌ ${name}: ${err.message}`);
  }
}

async function start() {
  await fs.ensureDir(OUTPUT_DIR);
  await fs.emptyDir(OUTPUT_DIR);
  const files = (await fs.readdir(INPUT_DIR)).filter(f => ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(f).toLowerCase()));

  for (const file of files) await processImage(file);
  console.log("🏁 Operação Limpeza Total V42 Concluída.");
}

start();
