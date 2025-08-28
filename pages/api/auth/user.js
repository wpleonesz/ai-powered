import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import UserData from '@database/base/user';
import prismaClient from '@database/client';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(database(UserData))
  .get((request) => {
    request.do(null, async (api, _prisma) => {
      if (!request.user) return api.unauthorized();

      try {
        // Enfoque más básico y directo usando el cliente Prisma directamente
        const user = await prismaClient.base_user.findUnique({
          where: { id: request.user.id },
          include: {
            Person: true,
            Institution: true,
            Campus: true,
            AccountType: true,
            roles: {
              include: {
                Role: true,
              },
              where: {
                active: true,
              },
            },
          },
        });

        return api.successOne(user);
      } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
        return api.error('Error al obtener datos de usuario');
      }
    });
  });

export default handler;
