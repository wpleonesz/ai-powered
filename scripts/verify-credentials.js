const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

/**
 * Script para verificar si un usuario puede autenticarse correctamente
 * Comprueba si la contraseña proporcionada coincide con la almacenada en la base de datos
 */

// Función para hashear la contraseña usando el mismo algoritmo que en lib/hash/index.js
function hashPassword(password) {
  const passwordSecret = process.env.PASSWORD_SECRET || '';
  const algorithm = process.env.HASH_ALGORITHM || 'sha256';
  const input = `${passwordSecret}${password}`;
  return crypto.createHash(algorithm).update(input).digest('hex');
}

// Función para verificar credenciales
async function verifyCredentials(username, password) {
  try {
    console.log(`Verificando credenciales para usuario: ${username}`);

    // Buscar el usuario por nombre de usuario
    const user = await prisma.base_user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!user) {
      console.error(`Usuario ${username} no encontrado`);
      return { success: false, error: 'Usuario no encontrado' };
    }

    console.log(`Usuario encontrado: ${user.username} (ID: ${user.id})`);

    // Hashear la contraseña proporcionada
    const hashedPassword = hashPassword(password);

    console.log('Hash almacenado en DB: ', user.password);
    console.log('Hash calculado:       ', hashedPassword);

    // Comparar las contraseñas
    const passwordMatch = user.password === hashedPassword;

    if (passwordMatch) {
      console.log('✅ La contraseña es correcta');
      return { success: true, user };
    } else {
      console.log('❌ La contraseña es incorrecta');
      return { success: false, error: 'Contraseña incorrecta' };
    }
  } catch (error) {
    console.error('Error al verificar credenciales:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Argumentos de línea de comandos
const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error('Uso: node verify-credentials.js <username> <password>');
  process.exit(1);
}

// Ejecutar la verificación
verifyCredentials(username, password)
  .then((result) => {
    if (result.success) {
      console.log('Autenticación exitosa');
      console.log(`Nombre: ${result.user.username}`);
      console.log(`Email: ${result.user.email}`);
      console.log(`Estado: ${result.user.active ? 'Activo' : 'Inactivo'}`);
    } else {
      console.error(`Autenticación fallida: ${result.error}`);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Error durante la verificación:', error);
    process.exit(1);
  });
