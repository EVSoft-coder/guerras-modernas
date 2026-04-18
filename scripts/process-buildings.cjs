const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../resources/assets/buildings_raw');
const OUTPUT_DIR = path.join(__dirname, '../public/images/buildings');

// Escalas padrão AAA
const TARGET_SIZES = {
  qg: 200,
  quartel: 110,
  fabrica_municoes: 110,
  central_energia: 90,
  centro_pesquisa: 90,
  radar_estrategico: 90,
  aerodromo: 120,
  muralha: 140,
  mine: 100,
  housing: 110
};

const DEFAULT_SIZE = 100;

async function processImage(file) {
  const name = path.parse(file).name;
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, `${name}.png`);

  const targetHeight = TARGET_SIZES[name] || DEFAULT_SIZE;

  try {
    // 1. Carregar e fazer trim (remover bordas vazias)
    const trimmedBuffer = await sharp(inputPath)
      .ensureAlpha()
      .trim()
      .toBuffer();

    // 2. Redimensionar preservando proporção
    const resizedImage = sharp(trimmedBuffer).resize({
      height: targetHeight,
      withoutEnlargement: false,
    });

    const { width: resizedWidth, height: resizedHeight } = await resizedImage.metadata();

    // 3. Criar canvas final (Garantindo que a base do edifício toca o fundo)
    // Usamos um canvas de largura proporcional para não sobrar espaço lateral
    const finalWidth = resizedWidth; 
    const finalHeight = resizedHeight;

    await sharp({
      create: {
        width: finalWidth,
        height: finalHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: await resizedImage.toBuffer(),
          top: 0, // Como o canvas tem o tamanho da imagem redimensionada, 0 ja é o topo
          left: 0,
        },
      ])
      .png()
      .toFile(outputPath);

    console.log(`✔ Processado com precisão: ${file} (Altura: ${targetHeight}px)`);
  } catch (error) {
    console.error(`❌ Falha crítica em ${file}:`, error);
  }
}

async function run() {
  console.log('--- INICIANDO PIPELINE DE ASSETS PROFISSIONAL ---');
  
  await fs.ensureDir(INPUT_DIR);
  await fs.ensureDir(OUTPUT_DIR);

  const files = await fs.readdir(INPUT_DIR);
  const images = files.filter(f =>
    ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(f).toLowerCase())
  );

  if (images.length === 0) {
    console.log('⚠ Nenhuma imagem encontrada em /resources/assets/buildings_raw');
    return;
  }

  for (const file of images) {
    await processImage(file);
  }

  console.log('\n🚀 Missão cumprida: Todos os assets estão normalizados!');
}

run();
