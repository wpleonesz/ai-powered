import PersonData from '@database/base/person';
import UserData from '@database/base/user';
import schemas from '@database/base/user/schemas';
import { smtpSever } from '@lib/mail/server';
import { hash } from '@lib/hash';
import { dates } from '@lib/dates';
import { toInteger } from 'lodash';

const login = async (username, password, institutionId) => {
  // Admin mock
  if (username == 'admin') {
    const userData = new UserData();
    const user = await userData
      .select(schemas.CREDENTIALS)
      .where({
        username: username,
        password: hash.create(password),
      })
      .getFirst();
    if (!user) throw new Error('Usuario o contraseña incorrectos');
    if (institutionId) await userData.record(user.id).update({ institutionId });
    return {
      id: user.id,
      username: user.username,
      name: user.username,
      email: user.email,
      institutionId: user.institutionId,
    };
  }

  // Usuario regular
  const userData = new UserData();
  const user = await userData
    .select(schemas.CREDENTIALS)
    .where({
      OR: [{ active: true }, { active: false }],
      username: username,
      password: hash.create(password),
    })
    .getFirst();

  if (!user) throw new Error('Usuario o contraseña incorrectos');

  if (!user.active)
    throw new Error(
      'Su cuenta se encuentra desactivada, si este no debería ser el caso por favor comuníquese con el administrador',
    );

  // Verificar si la contraseña ha expirado
  if (user.lastPasswordDate) {
    const userDueDays = dates.dueDaysUntil(user.lastPasswordDate, 180);

    if (userDueDays <= 0)
      throw new Error(
        'Su contraseña ha caducado, por motivos de seguridad debe cambiar su contraseña antes de poder iniciar sesión.',
      );
  }

  return {
    id: user.id,
    username: user.username,
    name: user.Person?.name || user.username,
    dni: user.Person?.dni,
    email: user.email,
    institutionId: user.institutionId,
  };
};

const createRecoverToken = async (
  prisma,
  userId,
  personalEmail,
  userEmail,
  personalName,
  username,
) => {
  const recoverDate = new Date();
  const now = dates.toString(recoverDate);
  const recoverToken = hash.create(`${personalEmail}${now}`);
  const user = await prisma.user
    .record(userId)
    .update({ recoverToken, recoverDate });
  const institution = await prisma.institution
    .record(user.institutionId)
    .getUnique();
  await smtpSever.sendMAilServerNotification(
    personalEmail,
    userEmail,
    personalName,
    username,
    recoverToken,
    institution,
    'No fue posible enviar el correo de recuperación, por favor intente mas tarde',
  );
};

const getUser = async (data) => {
  try {
    const personData = new PersonData();
    const person = await personData.create({
      dni: data.dni,
      name: `${data.firstName} ${data.lastName}`.toUpperCase(),
      email: data.email,
      lastName: data.lastName.toUpperCase(),
      firstName: data.firstName.toUpperCase(),
      mobile: data.mobile,
    });
    const userData = new UserData();
    const user = await userData.create({
      username: data.username || data.email,
      password: hash.create(data.password),
      email: data.email,
      createdDate: new Date(),
      modifiedDate: new Date(),
      lastPasswordDate: new Date(),
      personId: toInteger(person.id),
      institutionId: data.institutionId ? toInteger(data.institutionId) : null,
    });
    return { user, person };
  } catch (error) {
    return Promise.reject(
      `Ocurrió un error al crear el usuario: ${error.message}`,
    );
  }
};

const formatName = (firstName, lastName) => {
  return `${firstName} ${lastName}`.toUpperCase();
};

export const userHelper = {
  login,
  createRecoverToken,
  getUser,
  formatName,
};
