import nextConnect from 'next-connect';
import api from '@middleware/api';
import parser from '@middleware/parser';
import database from '@middleware/database';
import UserData from '@database/base/user';
import { hash } from '@lib/hash';
import { checkExpiration } from '@lib/tokens';

const handler = nextConnect();

const NOTOKEN_ERROR = 'Token inválido para realizar esta operación';

const getRecoverToken = (request) => {
  const token = request.query.token;
  if (!token) throw new Error(NOTOKEN_ERROR);
  return token;
};

const getUser = async (db, recoverToken) => {
  const user = await db.where({ recoverToken }).getFirst();
  if (!user) throw new Error(NOTOKEN_ERROR);
  return user;
};

handler
  .use(api)
  .use(parser)
  .use(database(UserData))
  .put((request) => {
    request.do(
      null,
      async (api, prisma) => {
        let data = request.body;
        const user = await getUser(prisma.user, getRecoverToken(request));
        prisma.user.setAudited(user);
        checkExpiration(user.recoverDate);
        // Ya no usamos LDAP para el cambio de contraseña
        // Update local user
        await prisma.user
          .clean()
          .record(user.id)
          .update({
            password: hash.create(data.password),
            recoverToken: '',
            recoverDate: null,
          });
        return api.success();
      },
      { transaction: true },
    );
  });

export default handler;
