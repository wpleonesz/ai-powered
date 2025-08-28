import passport from 'passport';
import LocalStrategy from 'passport-local';
import UserData from '@database/base/user';
import { userHelper } from '@helper/user';
import { toInteger } from 'lodash';

/** Serializa en passport el usuario que inicia sesión  */
passport.serializeUser((user, done) => {
  done(null, user.username);
});

/** Deserializa el usuario que inicia sesión */
passport.deserializeUser(async (_, id, done) => {
  const userData = new UserData();
  const user = await userData
    .select({
      id: true,
      username: true,
      email: true,
      institutionId: true,
      campusId: true,
      Institution: {
        select: { name: true, logo: true, isologo: true },
      },
      Person: { select: { id: true, name: true, dni: true } },
      roles: { select: { roleId: true } },
    })
    .where({ username: id })
    .getUnique();
  done(null, user);
});

/** Inicializa la estrategia de inicio de sesión en passport, comprueba los datos
 * e inicializa la sesión */
passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    async (request, username, password, done) => {
      try {
        const institutionId = toInteger(request.body.institutionId);
        const user = await userHelper.login(username, password, institutionId);
        done(null, user);
      } catch (error) {
        done(null, {
          username: 'undefined',
          message: error.message,
          error: true,
        });
      }
    },
  ),
);

export default passport;
