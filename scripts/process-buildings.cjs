const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '../resources/assets/buildings_raw');
const CLEAN_DIR = path.join(__dirname, '../public/images/buildings');

const ASSETS = {
  qg: { w: 200, h: 200 },
  quartel: { w: 110, h: 110 },
  fabrica_municoes: { w: 110, h: 110 },
  central_energia: { w: 90, h: 90 },
  centro_pesquisa: { w: 90, h: 90 },
  radar_estrategico: { w: 90, h: 90 },
  aerodromo: { w: 120, h: 120 },
  muralha: { w: 260, h: 110 },
  mine: { w: 100, h: 100 },
  housing: { w: 110, h: 110 }
};

async function processImages() {
  console.log('--- INICIANDO PROCESSAMENTO DE ASSETS AAA ---');
  
  if (!fs.existsSync(CLEAN_DIR)) {
    fs.mkdirSync(CLEAN_DIR, { recursive: true });
  }

  const files = fs.readdirSync(RAW_DIR);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.webp') continue;

    const type = path.parse(file).name;
    const config = ASSETS[type];

    if (!config) {
      console.log(`[AVISO] Sem config para ${file}. Ignorando.`);
      continue;
    }

    try {
      console.log(`[PROCESSANDO] ${type}...`);
      
      await sharp(path.join(RAW_DIR, file))
        .trim() // Remove margens transparentes ou pretas vazias
        .resize(config.w, config.h, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 1 } // Força fundo preto para o blend mode lighten
        })
        .png()
        .toFile(path.join(CLEAN_DIR, `${type}.png`));
        
      console.log(`[OK] ${type} processado com sucesso.`);
    } catch (err) {
      console.error(`[ERRO] Falha ao processar ${type}:`, err);
    }
  }
  
  console.log('--- PROCESSAMENTO CONCLUÍDO ---');
}

processImages();
