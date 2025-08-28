// scripts/generate-pwa-icons.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Definiciones de colores e iconos
const primaryColor = '#3f51b5'; // Color primario de Material UI en tu tema
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconFolder = path.join(__dirname, '../public/assets/icons');

// Asegúrate de que el directorio de iconos exista
if (!fs.existsSync(iconFolder)) {
  fs.mkdirSync(iconFolder, { recursive: true });
}

const generateIcons = async () => {
  try {
    console.log('Generando iconos PWA manteniendo el favicon original');

    // Creamos una imagen simple para los iconos de PWA
    // Esto no afectará al favicon original
    const baseImage = Buffer.from(
      `<svg width="512" height="512">
        <rect width="512" height="512" fill="${primaryColor}"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="180" fill="white">UEA</text>
      </svg>`,
    );

    // Generar todos los tamaños de iconos para PWA
    for (const size of iconSizes) {
      await sharp(baseImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 63, g: 81, b: 181, alpha: 1 },
        })
        .png()
        .toFile(path.join(iconFolder, `icon-${size}x${size}.png`));

      console.log(`Generado icono ${size}x${size}`);
    }

    // No actualizamos el favicon.ico porque queremos mantener el original

    console.log('Todos los iconos PWA han sido generados correctamente');
  } catch (error) {
    console.error('Error al generar iconos PWA:', error);
  }
};

generateIcons();
