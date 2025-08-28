import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import CampusData, { ESCAPE } from '@database/base/campus';

const handler = nextConnect();

handler
  .use(auth)
  .use(api)
  .use(access('campus'))
  .use(database(CampusData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successMany(
        await prisma.campus
          .where({ institutionId: request.user?.institutionId || undefined })
          .getAll(),
      );
    });
  })
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do('create', async (api, prisma) => {
      return api.success(await prisma.campus.create(request.body));
    });
  });

export default handler;
