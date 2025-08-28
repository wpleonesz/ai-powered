import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import UserData from '@database/base/user';
import prismaClient from '@database/client';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('user'))
  .use(database(UserData))
  .get((request) => {
    request.do('read', async (api, _prisma) => {
      try {
        // Intentamos una consulta directa a la base de datos para mayor rapidez
        const user = await prismaClient.base_user.findUnique({
          where: { id: request.user.id },
          select: {
            Institution: {
              select: {
                id: true,
                name: true,
                campus: {
                  where: { active: true },
                  select: { id: true, name: true },
                },
              },
            },
          },
        });

        const defaultInstitution = {
          id: 1,
          name: 'Institución por defecto',
          campus: [
            { id: 1, name: 'Campus Principal' },
            { id: 2, name: 'Campus Secundario' },
          ],
        };

        return api.successOne(user?.Institution || defaultInstitution);
      } catch (error) {
        console.error('Error al obtener institución:', error);
        return api.successOne(defaultInstitution);
      }
    });
  });

export default handler;
