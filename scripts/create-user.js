const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

/**
 * Script para crear un nuevo usuario con la contraseña correctamente hasheada
 */
const createUser = async (userData) => {
  try {
    // Validar datos requeridos
    if (
      !userData.username ||
      !userData.email ||
      !userData.password ||
      !userData.campusId
    ) {
      console.error(
        'Faltan datos requeridos (username, email, password, campusId)',
      );
      return { success: false, error: 'Datos incompletos' };
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.base_user.findFirst({
      where: {
        OR: [{ username: userData.username }, { email: userData.email }],
      },
    });

    if (existingUser) {
      console.error(
        `Ya existe un usuario con el nombre de usuario "${existingUser.username}" o el correo "${existingUser.email}"`,
      );
      return { success: false, error: 'Usuario ya existe' };
    }

    // Crear o encontrar la persona
    let person;
    if (userData.dni) {
      person = await prisma.base_person.findUnique({
        where: { dni: userData.dni },
      });

      if (!person) {
        // Crear la persona si no existe
        person = await prisma.base_person.create({
          data: {
            dni: userData.dni,
            name: `${userData.firstName || ''} ${userData.lastName || ''}`
              .trim()
              .toUpperCase(),
            firstName: (userData.firstName || '').toUpperCase(),
            lastName: (userData.lastName || '').toUpperCase(),
            email: userData.personalEmail || userData.email,
            mobile: userData.mobile || null,
            createdDate: new Date(),
            modifiedDate: new Date(),
          },
        });
        console.log(`Persona creada: ${person.name}`);
      }
    }

    // Hash de la contraseña - usando el mismo algoritmo que en lib/hash/index.js
    const passwordSecret = process.env.PASSWORD_SECRET || '';
    const algorithm = process.env.HASH_ALGORITHM || 'sha256';
    const input = `${passwordSecret}${userData.password}`;
    const hashedPassword = crypto
      .createHash(algorithm)
      .update(input)
      .digest('hex');

    // Crear el usuario
    const now = new Date();
    const user = await prisma.base_user.create({
      data: {
        username: userData.username.toLowerCase(),
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        createdDate: now,
        modifiedDate: now,
        institutionId: userData.institutionId || 1, // Usar 1 como default si no se proporciona
        campusId: userData.campusId,
        personId: person?.id,
        active: userData.active !== undefined ? userData.active : true,
        // Crear roles si se proporcionan
        roles:
          userData.roles && userData.roles.length > 0
            ? {
                create: userData.roles.map((roleId) => ({
                  roleId: parseInt(roleId, 10),
                  active: true,
                })),
              }
            : undefined,
      },
    });

    console.log(`Usuario creado: ${user.username}`);
    return { success: true, user };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
};

// Datos de prueba para el nuevo usuario
const userData = {
  username: process.argv[2] || 'usuario.prueba',
  email: process.argv[3] || 'usuario.prueba@ejemplo.edu.ec',
  password: process.argv[4] || 'Password123@',
  firstName: 'Usuario',
  lastName: 'Prueba',
  dni: '1234567890',
  campusId: 1,
  roles: [1], // ID del rol (generalmente 1 es el rol básico de usuario)
};

// Ejecutar la creación
createUser(userData)
  .then((result) => {
    if (result.success) {
      console.log('✅ Usuario creado exitosamente');
      console.log('Detalles del usuario:');
      console.log(`- Username: ${result.user.username}`);
      console.log(`- Email: ${result.user.email}`);
      console.log(`- ID: ${result.user.id}`);
      console.log(`Puede iniciar sesión con:`);
      console.log(`Usuario: ${userData.username}`);
      console.log(`Contraseña: ${userData.password}`);
    } else {
      console.log('❌ No se pudo crear el usuario:', result.error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
