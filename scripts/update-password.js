const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
require('dotenv').config();

const prisma = new PrismaClient();

/**
 * Script para actualizar la contraseña de un usuario usando el mismo algoritmo de hash
 * que utiliza la aplicación
 */

// Función para hashear la contraseña usando el mismo algoritmo que en lib/hash/index.js
function hashPassword(password) {
  const passwordSecret = process.env.PASSWORD_SECRET || '';
  const algorithm = process.env.HASH_ALGORITHM || 'sha256';
  const input = `${passwordSecret}${password}`;
  return crypto.createHash(algorithm).update(input).digest('hex');
}

// Función para actualizar la contraseña de un usuario
async function updatePassword(usernameOrEmail, newPassword) {
  try {
    console.log(`Buscando usuario: ${usernameOrEmail}`);

    // Buscar el usuario por nombre de usuario o email
    const user = await prisma.base_user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail.toLowerCase() },
          { email: usernameOrEmail.toLowerCase() },
        ],
      },
    });

    if (!user) {
      console.error(`Usuario no encontrado: ${usernameOrEmail}`);
      return { success: false, error: 'Usuario no encontrado' };
    }

    console.log(`Usuario encontrado: ${user.username} (ID: ${user.id})`);

    // Hashear la nueva contraseña
    const hashedPassword = hashPassword(newPassword);

    // Actualizar la contraseña
    const updatedUser = await prisma.base_user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        lastPasswordDate: new Date(), // Actualizar la fecha de cambio de contraseña
        modifiedDate: new Date(),
      },
    });

    console.log(`✅ Contraseña actualizada para: ${updatedUser.username}`);
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Argumentos de línea de comandos
const usernameOrEmail = process.argv[2];
const newPassword = process.argv[3];

if (!usernameOrEmail || !newPassword) {
  console.error(
    'Uso: node update-password.js <username_o_email> <nueva_contraseña>',
  );
  process.exit(1);
}

// Ejecutar la actualización
updatePassword(usernameOrEmail, newPassword)
  .then((result) => {
    if (result.success) {
      console.log('La contraseña ha sido actualizada correctamente');
      console.log(`Usuario: ${result.user.username}`);
      console.log(`Email: ${result.user.email}`);
      console.log('Puede iniciar sesión con la nueva contraseña ahora');
    } else {
      console.error(`Error al actualizar la contraseña: ${result.error}`);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Error durante la actualización:', error);
    process.exit(1);
  });
