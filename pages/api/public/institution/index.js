import nextConnect from 'next-connect';
import api from '@middleware/api';
import database from '@middleware/database';
import InstitutionData from '@database/base/institution';

const handler = nextConnect();

handler
  .use(api)
  .use(database(InstitutionData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(
        await prisma.institution.orderBy({ id: 'asc' }).getAll(),
      );
    });
  });

export default handler;
