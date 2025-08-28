const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Asegúrate de que el directorio de iconos existe
const iconsDir = path.join(__dirname, '../public/assets/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Ruta a tu icono fuente (usa el favicon existente como base)
const sourceIcon = path.join(__dirname, '../public/favicon.ico');

// Configuraciones para iconos de Apple
const appleIcons = [
  { name: 'apple-icon-152x152.png', size: 152 },
  { name: 'apple-icon-180x180.png', size: 180 },
];

// Configuraciones para pantallas de inicio (splash screens)
const appleSplashScreens = [
  { name: 'apple-splash-2048-2732.png', width: 2048, height: 2732 },
  { name: 'apple-splash-1668-2388.png', width: 1668, height: 2388 },
  { name: 'apple-splash-1536-2048.png', width: 1536, height: 2048 },
  { name: 'apple-splash-1125-2436.png', width: 1125, height: 2436 },
  { name: 'apple-splash-828-1792.png', width: 828, height: 1792 },
  { name: 'apple-splash-750-1334.png', width: 750, height: 1334 },
];

// Genera iconos cuadrados para Apple
const generateAppleIcons = async () => {
  try {
    for (const icon of appleIcons) {
      await sharp(sourceIcon)
        .resize(icon.size, icon.size)
        .toFile(path.join(iconsDir, icon.name));
      console.log(`✅ Generado: ${icon.name}`);
    }
  } catch (error) {
    console.error('❌ Error generando iconos de Apple:', error);
  }
};

// Genera pantallas de inicio para Apple
const generateAppleSplashScreens = async () => {
  try {
    // Crear un fondo con el color principal
    const backgroundColor = '#0057B8'; // Usa el color principal de tu tema

    for (const screen of appleSplashScreens) {
      // Crear un fondo del tamaño correcto
      const splash = await sharp({
        create: {
          width: screen.width,
          height: screen.height,
          channels: 4,
          background: backgroundColor,
        },
      })
        .png()
        .toBuffer();

      // Redimensionar el logo para que ocupe aproximadamente el 30% del ancho
      const logoSize = Math.round(screen.width * 0.3);
      const resizedLogo = await sharp(sourceIcon)
        .resize(logoSize, logoSize)
        .toBuffer();

      // Colocar el logo en el centro del splash
      await sharp(splash)
        .composite([
          {
            input: resizedLogo,
            gravity: 'center',
          },
        ])
        .toFile(path.join(iconsDir, screen.name));

      console.log(`✅ Generada pantalla de inicio: ${screen.name}`);
    }
  } catch (error) {
    console.error('❌ Error generando pantallas de inicio para Apple:', error);
  }
};

// Ejecutar la generación
const generateAll = async () => {
  console.log('🔄 Generando iconos para iOS...');
  await generateAppleIcons();
  console.log('🔄 Generando pantallas de inicio para iOS...');
  await generateAppleSplashScreens();
  console.log('✅ ¡Todos los iconos para iOS han sido generados!');
};

generateAll();
