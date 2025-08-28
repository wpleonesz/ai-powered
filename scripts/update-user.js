const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Script para actualizar un usuario existente por su correo electrónico
 * Útil para actualizar o completar información de usuarios parciales/pruebas
 */
const updateUserByEmail = async (email, userData) => {
  try {
    // Verificar si el usuario existe
    const existingUser = await prisma.base_user.findUnique({
      where: { email },
      include: {
        Person: true,
        roles: {
          include: {
            Role: true,
          },
        },
      },
    });

    if (!existingUser) {
      console.error(`No se encontró ningún usuario con el correo: ${email}`);
      return null;
    }

    console.log(
      `Usuario encontrado: ID ${existingUser.id}, Username: ${existingUser.username}`,
    );
    console.log(
      'Roles actuales:',
      existingUser.roles.map((r) => r.Role?.name || r.roleId).join(', '),
    );

    // Preparar datos para actualización
    const now = new Date();
    const updateData = {
      // Campos que podrían ser actualizados
      active:
        userData.active !== undefined ? userData.active : existingUser.active,
      modifiedDate: now,
    };

    // Actualizar nombre de usuario si se proporciona
    if (userData.username) {
      // Verificar si el nuevo nombre de usuario ya existe
      const usernameExists = await prisma.base_user.findUnique({
        where: { username: userData.username },
      });

      if (usernameExists && usernameExists.id !== existingUser.id) {
        console.log(
          `⚠️ El nombre de usuario ${userData.username} ya está en uso por otro usuario. No se puede actualizar.`,
        );
      } else {
        updateData.username = userData.username.toLowerCase();
        console.log(
          `Se actualizará el nombre de usuario a: ${userData.username}`,
        );
      }
    }

    // Actualizar contraseña solo si se proporciona
    if (userData.password) {
      // Hash de la contraseña - usando el mismo método que la aplicación
      // Creamos manualmente el hash siguiendo el mismo algoritmo que en lib/hash/index.js
      const crypto = require('crypto');
      const passwordSecret = process.env.PASSWORD_SECRET || '';
      const algorithm = process.env.HASH_ALGORITHM || 'sha256';
      const input = `${passwordSecret}${userData.password}`;
      const hashedPassword = crypto
        .createHash(algorithm)
        .update(input)
        .digest('hex');

      updateData.password = hashedPassword;
      updateData.lastPasswordDate = now;
      console.log('Se actualizará la contraseña');
    }

    // Si se especifica un campus, actualizarlo
    if (userData.campusId) {
      updateData.campusId = userData.campusId;
      console.log(`Se actualizará el campus a ID: ${userData.campusId}`);
    }

    // Actualizar datos de la persona si existen
    let personUpdateData = null;
    if (
      existingUser.personId &&
      (userData.firstName ||
        userData.lastName ||
        userData.mobile ||
        userData.dni)
    ) {
      personUpdateData = {};

      if (userData.firstName)
        personUpdateData.firstName = userData.firstName.toUpperCase();
      if (userData.lastName)
        personUpdateData.lastName = userData.lastName.toUpperCase();
      if (userData.firstName && userData.lastName) {
        personUpdateData.name = `${userData.firstName.toUpperCase()} ${userData.lastName.toUpperCase()}`;
      }
      if (userData.mobile) personUpdateData.mobile = userData.mobile;
      if (userData.dni) personUpdateData.dni = userData.dni;
      if (userData.personalEmail)
        personUpdateData.email = userData.personalEmail.toLowerCase();

      console.log('Se actualizarán datos personales');
    }

    // Actualizar roles si se proporcionan

    if (Array.isArray(userData.roles) && userData.roles.length > 0) {
      // Primero eliminar los roles actuales
      await prisma.base_rolesOnUsers.deleteMany({
        where: {
          userId: existingUser.id,
        },
      });

      // Luego crear los nuevos roles
      const roleCreations = userData.roles.map((roleId) => ({
        roleId: parseInt(roleId, 10),
        active: true,
        userId: existingUser.id,
      }));

      await prisma.base_rolesOnUsers.createMany({
        data: roleCreations,
      });

      console.log(`Se actualizaron los roles: ${userData.roles.join(', ')}`);
    }

    // Realizar la actualización del usuario
    const updatedUser = await prisma.base_user.update({
      where: { id: existingUser.id },
      data: updateData,
    });

    console.log(`Usuario actualizado: ${updatedUser.username}`);

    // Actualizar la persona si hay datos
    if (personUpdateData && existingUser.personId) {
      const updatedPerson = await prisma.base_person.update({
        where: { id: existingUser.personId },
        data: personUpdateData,
      });

      console.log(`Persona actualizada: ${updatedPerson.name}`);
    }

    return {
      success: true,
      user: {
        ...updatedUser,
        Person:
          personUpdateData && existingUser.personId
            ? await prisma.base_person.findUnique({
                where: { id: existingUser.personId },
              })
            : existingUser.Person,
      },
    };
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return {
      success: false,
      error: error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
};

// Obtener argumentos
const email = process.argv[2];
const dataArg = process.argv[3]; // Datos en formato JSON como string

if (!email) {
  console.log(
    'Uso: node scripts/update-user.js <email> \'{"clave": "valor", ...}\'',
  );
  console.log(
    'Ejemplo: node scripts/update-user.js wp.leonesz@ejemplo.edu.ec \'{"password": "NuevaPass123@", "roles": [1,2]}\'',
  );
  process.exit(1);
}

// Datos por defecto
let userData = {};

// Intentar parsear los datos JSON si se proporcionaron
if (dataArg) {
  try {
    userData = JSON.parse(dataArg);
  } catch (e) {
    console.error('Error al analizar datos JSON:', e.message);
    process.exit(1);
  }
}

// Ejecutar la actualización
updateUserByEmail(email, userData)
  .then((result) => {
    if (result && result.success) {
      console.log('✅ Actualización completada con éxito');
    } else {
      console.log('❌ Falló la actualización');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
