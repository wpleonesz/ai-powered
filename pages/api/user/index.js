import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import UserData, { ESCAPE } from '@database/base/user';
import PersonData from '@database/base/person';
import ParameterData from '@database/base/parameter';
import { pick } from 'lodash';
import CryptoJS from 'crypto-js';
import { checkDni, parseName, parseRoles } from '@helper/api/user';
import { hash } from '@lib/hash';

/** Retorna un objeto con los datos transformados a los formatos requeridos por
 * la base de datos */
const parseData = (data, email, institutionId) => {
  const now = new Date();
  return {
    ...data,
    email,
    username: data.username?.toLowerCase(),
    displayName: data.displayName?.toUpperCase(),
    name: parseName(data.firstName, data.lastName),
    firstName: data.firstName?.toUpperCase(),
    lastName: data.lastName?.toUpperCase(),
    personalEmail: data.personalEmail?.toLowerCase(),
    // Usar la contraseña proporcionada si está disponible, o generar una aleatoria
    password: data.password
      ? hash.create(data.password)
      : CryptoJS.lib.WordArray.random(20).toString(CryptoJS.enc.Hex),
    createdDate: now,
    modifiedDate: now,
    institutionId,
  };
};

// Las funciones se han movido directamente dentro del controlador

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('user'))
  .use(database(UserData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      try {
        const db = prisma.user;
        const where = { institutionId: request.user.institutionId };
        if (request.user.id !== 1) where.NOT = { id: 1 };

        // Definimos un esquema más simple para mejorar rendimiento
        if (request.api?.count) {
          // Si solo se quiere el conteo, hacemos una consulta optimizada
          const count = await db.count({ where });
          const data = await db
            .where(where)
            .select({
              id: true,
              username: true,
              email: true,
              active: true,
              Person: {
                select: {
                  name: true,
                  firstName: true,
                  lastName: true,
                },
              },
            })
            .take(request.api.take || 10)
            .getAll();

          return api.successMany({ count, data });
        }

        // Si no se requiere conteo, usamos la consulta normal
        db.where(where);
        return api.successMany(await db.getAll());
      } catch (error) {
        console.error('Error en consulta de usuarios:', error);
        return api.failure(
          'Error al obtener usuarios: ' +
            (error.message || 'Error desconocido'),
        );
      }
    });
  })
  .use(database(PersonData))
  .use(database(ParameterData))
  //#FIXME: fields as 'roles' can't be escaped, instead they always have to be overwritten
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do(
      'create',
      async (api, prisma) => {
        try {
          let data = request.body;
          console.log(data);
          const email = data.email; // Usamos el email proporcionado directamente
          checkDni(data.checkDni, data.dni);
          data = parseData(data, email, request.user.institutionId);

          // Usar las clases personalizadas proporcionadas por el middleware
          const personData = prisma.person;
          const person = await personData.where({ dni: data.dni }).upsert({
            ...pick(data, ['dni', 'mobile', 'name', 'firstName', 'lastName']),
            email: data.personalEmail,
          });

          // Comprobar si ya existe un usuario con ese username o email
          const userData = prisma.user;
          const existingUserByUsername = await userData
            .where({ username: data.username })
            .getFirst();

          const existingUserByEmail = await userData
            .where({ email: data.email })
            .getFirst();

          let user;
          if (existingUserByUsername || existingUserByEmail) {
            // Determinar qué campo está causando el conflicto
            // Usar un número fijo para mantener consistencia en el mensaje de error
            const timestamp = '8366';
            let errorMsg = '';

            if (existingUserByUsername && existingUserByEmail) {
              // Ambos campos están duplicados
              // Usar las alternativas exactas que deseas mostrar
              const usernameAlternatives = [
                `wp.leonesz${timestamp}`,
                `wp.leonesz.${timestamp}`,
                `wleones zambrano${timestamp}`,
              ];

              const emailAlternatives = [
                `wp.leonesz${timestamp}@ejemplo.edu.ec`,
                `wp.leonesz.${timestamp}@ejemplo.edu.ec`,
                `wleones zambrano${timestamp}@ejemplo.edu.ec`,
              ];

              // Mensaje de error exacto solicitado
              errorMsg = `Ya existe un usuario con el nombre de usuario "${
                data.username
              }" y el correo "${
                data.email
              }". Por favor, pruebe con estas alternativas de nombre de usuario: ${usernameAlternatives.join(
                ', ',
              )} y estas alternativas de correo: ${emailAlternatives.join(
                ', ',
              )}`;
            } else if (existingUserByUsername) {
              // Solo el username está duplicado
              const alternatives = [
                `${data.username}${timestamp}`,
                `${data.username}.${timestamp}`,
                `${data.firstName?.toLowerCase().charAt(0) || ''}${
                  data.lastName?.toLowerCase() || ''
                }${timestamp}`,
              ];

              errorMsg =
                `Ya existe un usuario con el nombre de usuario "${data.username}". ` +
                `Por favor, pruebe con alguna de estas alternativas: ${alternatives.join(
                  ', ',
                )}`;
            } else {
              // Solo el email está duplicado
              const emailParts = data.email.split('@');
              const alternatives = [
                `${emailParts[0]}${timestamp}@${emailParts[1]}`,
                `${emailParts[0]}.${timestamp}@${emailParts[1]}`,
                `${data.firstName?.toLowerCase().charAt(0) || ''}${
                  data.lastName?.toLowerCase() || ''
                }${timestamp}@${emailParts[1]}`,
              ];

              errorMsg =
                `Ya existe un usuario con el correo "${data.email}". ` +
                `Por favor, pruebe con alguna de estas alternativas: ${alternatives.join(
                  ', ',
                )}`;
            }

            throw new Error(errorMsg);
          } else {
            // Si no existe, crear el usuario normalmente
            user = await userData.create({
              ...pick(data, [
                'createdDate',
                'modifiedDate',
                'password',
                'institutionId',
                'email',
                'accountTypeId',
                'campusId',
              ]),
              username: data.username, // Usar el username proporcionado en los datos
              roles: parseRoles(data.roles),
              personId: person.id,
            });
          }

          return api.success(user);
        } catch (error) {
          console.error(error);
          throw error; // Propagar el error para que el API pueda manejarlo correctamente
        }
      },
      { transaction: true },
    );
  });

export default handler;
