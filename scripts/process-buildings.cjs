const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../resources/assets/buildings_raw');
const OUTPUT_DIR = path.join(__dirname, '../public/images/buildings');

// Escalas padrão (ajustáveis conforme a Grelha V21)
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

  console.log(`[PROCESS] 🏗️  ${name} -> ${size}px (Fundo Transparente Forçado)`);

  try {
    // 1. CARREGAR E PREPARAR CANAL ALFA
    let pipeline = sharp(inputPath).ensureAlpha();

    // 2. REMOÇÃO DE FUNDO PRETO (THRESHOLD)
    // Criamos uma máscara onde pixels escuros (quase pretos) tornam-se transparentes
    // Usamos pipeline.raw() para manipular se necessário, mas o threshold no Alpha é mais rápido
    const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
    
    // Threshold para considerar "preto": RGB < 15
    const threshold = 15;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      if (r < threshold && g < threshold && b < threshold) {
        data[i+3] = 0; // Set Alpha to 0
      }
    }

    // 3. RECONSTRUIR, TRIM E REDIMENSIONAR
    await sharp(data, { raw: info })
      .trim() // Remove bordas vazias
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log(`[SUCCESS] ✅ ${name} exportado.`);
  } catch (err) {
    console.error(`[ERROR] ❌ Erro ao processar ${name}:`, err.message);
  }
}

async function start() {
  await fs.ensureDir(OUTPUT_DIR);
  
  if (!await fs.exists(INPUT_DIR)) {
    console.error(`[CRITICAL] ❌ Diretório de entrada não existe: ${INPUT_DIR}`);
    return;
  }

  const files = (await fs.readdir(INPUT_DIR)).filter(f => 
    ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(f).toLowerCase())
  );

  console.log(`[INIT] 🚀 Iniciando purificação de ${files.length} ativos...`);
  
  for (const file of files) {
    await processImage(file);
  }

  console.log(`[DONE] 🏆 Todos os ativos foram purificados.`);
}

start();
