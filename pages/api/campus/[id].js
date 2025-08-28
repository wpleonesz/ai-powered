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
      return api.successOne(
        await prisma.campus.record(request.query.id).getUnique(),
      );
    });
  })
  .delete((request) => {
    request.do('remove', async (api, prisma) => {
      return api.success(
        await prisma.campus.record(request.query.id).update({ active: false }),
      );
    });
  })
  .use(parser.escape(ESCAPE))
  .put((request) => {
    request.do('write', async (api, prisma) => {
      return api.success(
        await prisma.campus.record(request.query.id).update(request.body),
      );
    });
  });

export default handler;
