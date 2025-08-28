import nextConnect from 'next-connect';
//import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import parser from '@middleware/parser';
import PersonData from '@database/base/person';
import { v4 as uuidv4 } from 'uuid';

// Definir campos a escapar si es necesario
const ESCAPE = [
  'name',
  'firstName',
  'lastName',
  'address',
  'occupation',
  'nationality',
];

const handler = nextConnect();

handler
  .use(api)
  .use(access('person'))
  .use(database(PersonData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const { dni } = request.query;

      // Si se proporciona un DNI, buscar por DNI
      if (dni) {
        const person = await prisma.person.where({ dni }).getFirst();

        if (!person) {
          return api.error('Persona no encontrada', 404);
        }

        return api.success(person);
      }

      // Caso contrario, obtener todas las personas
      const persons = await prisma.person.orderBy({ id: 'asc' }).getAll();

      return api.successMany(persons);
    });
  })
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do('create', async (api, prisma) => {
      const {
        dni,
        firstName,
        lastName,
        email,
        institutionalEmail,
        mobile,
        address,
        gender,
        nationality,
        occupation,
        photo,
        birthDate,
      } = request.body;

      // Validar campos requeridos
      if (!dni || !firstName || !lastName) {
        return api.error(
          'Los campos DNI, Nombre y Apellido son requeridos',
          400,
        );
      }

      // Verificar si ya existe una persona con ese DNI
      const existingPerson = await prisma.person.where({ dni }).getFirst();

      if (existingPerson) {
        return api.error('Ya existe una persona con ese DNI', 409);
      }

      // Crear la nueva persona
      const name = `${firstName} ${lastName}`.toUpperCase();
      const instanceId = uuidv4();

      const newPerson = await prisma.person.create({
        dni,
        name,
        firstName,
        lastName,
        email,
        institutionalEmail,
        mobile,
        address,
        gender,
        nationality,
        occupation,
        photo,
        birthDate,
        instanceId,
      });

      return api.success(newPerson, 201);
    });
  });

export default handler;
