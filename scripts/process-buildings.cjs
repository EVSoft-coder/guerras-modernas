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

async function validateAndProcess(file) {
  const name = path.parse(file).name;
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const stats = await image.stats();
    
    // 1. TESTE DE TRANSPARÊNCIA (Fundo não transparente)
    // Se a média do alpha não for próxima da transparência esperada ou se o canal alpha nem existir
    if (!metadata.hasAlpha) {
       console.error(`INVALID ASSET: ${file} (FALTA CANAL ALPHA/FUNDO OPACO)`);
       return;
    }

    // 2. TESTE DE MARGENS (Margens vazias excessivas)
    // Usamos trim() e comparamos as dimensões
    const trimmed = await sharp(inputPath).trim().toBuffer({ resolveWithObject: true });
    const trimmedMeta = trimmed.info;
    if (trimmedMeta.width < metadata.width * 0.4 || trimmedMeta.height < metadata.height * 0.4) {
        console.error(`INVALID ASSET: ${file} (MARGENS VAZIAS EXCESSIVAS)`);
        return;
    }

    // 3. TESTE DE XADREZ (Checkerboard/Artefactos)
    // Analisamos os dados brutos para padrões neutros repetitivos no fundo
    const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
    let neutralPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
      const saturation = (Math.max(r,g,b) - Math.min(r,g,b)) / Math.max(r,g,b);
      // Se for um cinza claro e "meio transparente" (artefacto comum de checkerboard mal limpo)
      if (saturation < 0.05 && a > 0 && a < 255) {
        neutralPixels++;
      }
    }
    
    if (neutralPixels > (info.width * info.height * 0.05)) { // Mais de 5% de 'ruído cinza'
        console.error(`INVALID ASSET: ${file} (PADRÃO CHECKERBOARD/GRIDS DETECTADO)`);
        return;
    }

    // 4. PROCESSAMENTO FINAL (SE APROVADO)
    const targetH = TARGET_SIZES[name] || 150;
    await sharp(trimmed.data)
      .resize(null, targetH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }})
      .png()
      .toFile(outputPath);

    console.log(`[APPROVED] ✅ ${file} passou na auditoria crítica.`);

  } catch (err) {
    console.error(`[ERROR] ❌ ${file}: ${err.message}`);
  }
}

async function start() {
  await fs.ensureDir(OUTPUT_DIR);
  await fs.emptyDir(OUTPUT_DIR);
  const files = (await fs.readdir(INPUT_DIR)).filter(f => ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(f).toLowerCase()));

  console.log("🛑 Iniciando Auditoria Crítica de Ativos (Tolerância Zero)...");
  for (const file of files) await validateAndProcess(file);
  console.log("🏁 Operação V46 Concluída.");
}

start();
