import PersonData from '@database/base/person';
import UserData from '@database/base/user';
import RoleData from '@database/base/role';
import ParameterData from '@database/base/parameter';
import LogData from '@database/audit/log';
import prisma from '@database/client';
import { hash } from '@lib/hash';
import { parseMany2many } from '@helper/database/query';
import { v4 as uuidv4 } from 'uuid';

const generateUniqueId = () => uuidv4();

//const SPECIAL_DNIS = ['2002']; // Lista de DNIs especiales

export const userHandler = async (data) => {
  return await prisma.$transaction(async (client) => {
    const userData = new UserData();
    const personData = new PersonData();
    const logData = new LogData();
    userData.setTable(client);
    personData.setTable(client);
    logData.setTable(client);
    const [person, newPerson, personParams] = await managePerson(
      personData,
      data,
    );

    const [user, newUser, userParams] = await manageUser(
      userData,
      data,
      person,
    );
    await saveUserLog(logData, user, userParams, newUser);
    await savePersonLog(logData, user, person, personParams, newPerson);
    return signinResponse(user, person, data.institution);
  });
};

const savePersonLog = async (db, user, person, params, newPerson) => {
  if (!newPerson) return;
  await saveCreatedLog(db, user.id, 'base_person', person.id, params);
};

const saveUserLog = async (db, user, params, newUser) => {
  if (!newUser) return;
  params.password = '';
  await saveCreatedLog(db, user.id, 'base_user', user.id, params);
};

const saveCreatedLog = async (db, userId, table, recordId, params) => {
  await db.create({
    userId: userId,
    datetime: new Date(),
    table: table,
    record: recordId,
    action: 'create',
    data: params,
  });
};

const signinResponse = async (user, person, institution) => {
  return {
    id: user.id,
    username: user.username,
    name: person.name,
    dni: person.dni,
    email: user.email,
    institutionId: institution.name,
    instanceId: person.instanceId, // Información adicional para identificar el registro único
  };
};

export const managePerson = async (db, data) => {
  try {
    const isSpecialDni = data.dni === '2002';

    let person;

    if (isSpecialDni) {
      person = await db
        .where({
          dni: data.dni,
          users: { some: { email: data.email } },
        })
        .getFirst();

      const newPerson = !person;

      if (!person) {
        person = await createNewPersonWithConflict(db, data);
        return [person, true, parsePersonParams(data)];
      }

      // Forzar actualización del email personal si es diferente
      if (person.email !== data.personalEmail) {
        await db
          .clean()
          .where({ id: person.id })
          .update({ email: data.personalEmail });
      }

      const personParams = parsePersonParams(data);
      person = await upsertPerson(db, newPerson, personParams);
      return [person, newPerson, personParams];
    } else {
      person = await db
        .where({
          dni: data.dni,
          users: { some: { email: data.email } },
        })
        .getFirst();

      const newPerson = !person;

      if (person) {
        const isNameDifferent =
          person?.name !== data.name || person?.lastName !== data.lastName;

        if (isNameDifferent) {
          return await createNewPersonWithConflict(db, data);
        }

        // Forzar actualización del email personal si es diferente
        if (person.email !== data.personalEmail) {
          await db
            .clean()
            .where({ id: person.id })
            .update({ email: data.personalEmail });
        }
      }

      const personParams = parsePersonParams(data);
      person = await upsertPerson(db, newPerson, personParams);
      return [person, newPerson, personParams];
    }
  } catch (error) {
    throw new Error(`Error al gestionar la persona: ${error.message}`);
  }
};

const createNewPersonWithConflict = async (db, data) => {
  try {
    const personParams = parsePersonParams(data);
    const newPerson = await db.clean().create(personParams);
    return newPerson;
  } catch (error) {
    throw new Error(`Error al crear la persona: ${error.message}`);
  }
};

const upsertPerson = async (db, newPerson, data) => {
  const params = { ...data };

  // 🔹 Normalizar mobile para evitar errores
  if (Array.isArray(params.mobile) && params.mobile.length === 0) {
    params.mobile = null;
  } else if (Array.isArray(params.mobile)) {
    params.mobile = params.mobile.join(', ');
  }

  // ✅ Si es una nueva persona, crear sin consultar
  if (newPerson) {
    return await db.clean().create(params);
  }

  // 🔹 Buscar persona por dni e instanceId para evitar actualización errónea
  const existingPerson = await db
    .where({
      dni: params.dni,
      users: {
        some: { email: params.institutionalEmail }, // ✅ Buscar en users por email
      },
    })
    .getFirst();

  if (existingPerson) {
    return await db
      .clean()
      .where({ id: existingPerson.id }) // ✅ Solo actualizar si coincide id
      .update(params);
  } else {
    return await db.clean().create(params);
  }
};

const parsePersonParams = (data) => ({
  dni: data.dni,
  email: data.personalEmail, // Siempre usar el email personal de los datos actualizados
  institutionalEmail: data.email, // Email institucional
  name: data.name,
  lastName: data.lastName,
  firstName: data.firstName,
  mobile: data.mobile,
  instanceId: data.instanceId || generateUniqueId(),
});

export const manageUser = async (db, data, person) => {
  let user = await db.where({ username: data.email }).getUnique();
  const newUser = !user;
  let userParams = await parseUserParams(data, person, newUser);

  if (newUser) {
    user = await db.clean().create(userParams);
  } else {
    user = await db
      .clean()
      .where({ username: userParams.username })
      .update(userParams);
  }

  return [user, newUser, userParams];
};

const parseUserParams = async (params, person, isNew) => {
  // Proveer valor por defecto a institution si no está definido
  const institution = params.institution || { id: 1 };

  // Obtener tipo de cuenta predeterminado
  const accountTypeData = new ParameterData();
  const accountType = (await accountTypeData
    .where({ key: 'DEFAULT_ACCOUNT_TYPE' })
    .getFirst()) || { id: null };

  const userParams = {
    username: params.email,
    password: hash.create(params.password),
    email: params.email,
    createdDate: new Date(params.createdDate || new Date()),
    lastPasswordDate: new Date(params.lastPasswordDate || new Date()),
    modifiedDate: params.modifiedDate || new Date(),
    personId: person.id,
    institutionId: institution.id,
    accountTypeId: accountType.id,
  };

  // Asignar roles predeterminados si es un nuevo usuario
  if (isNew) {
    await parseRoles(userParams, null, isNew);
  }
  return userParams;
};

// Esta función ya no es necesaria, ya que buscamos el rol directamente en parseRoles
const parseRoles = async (userParams, distinguishedName, isNew) => {
  // Si no es un usuario nuevo, no es necesario asignar roles
  if (!isNew) return;

  const roleData = new RoleData();
  const defaultRole = await roleData
    .clean()
    .select({ id: true })
    .where({ code: 'user', active: true })
    .getFirst();

  // Asignar al menos el rol de usuario por defecto
  const roles = defaultRole ? [defaultRole.id] : [];

  // En este punto podríamos agregar lógica para determinar roles basados en otros parámetros
  // pero por ahora simplemente asignamos el rol de usuario

  if (roles.length > 0) {
    userParams.roles = parseMany2many('roleId', roles, {
      update: !isNew,
      deactivate: false,
    });
  }
};

// No se necesitan funciones adicionales relacionadas con LDAP
