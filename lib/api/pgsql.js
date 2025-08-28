import { Pool } from 'pg';
import { processDataBiometrics } from '@helper/api/biometrics';

const pool = new Pool({
  user: process.env.USER_POSTGRE,
  host: process.env.HOST_POSTGRE,
  database: process.env.NAMEDB_POSTGRE,
  password: process.env.PASSW_POSTGRE,
  port: 5432, // Puerto por defecto de PostgreSQL
});

const getQueryAppMarcaciones = async (startDate, endDate) => {
  try {
    //console.log('Fecha desde la base: ', startDate, endDate);
    const initDates = `${startDate} 00:00:00`;
    const endDates = `${endDate} 23:59:59`;
    const queryString = `SELECT  person.dni AS cedula, person.name AS nombre, 'Transferido - Aplicacion Movil' AS ubiBiometrico, TO_CHAR(attendance.datetime AT TIME ZONE 'UTC' AT TIME ZONE 'America/Guayaquil', 'DD/MM/YYYY HH24:MI:SS') AS fecha, attendance.states AS estado FROM app."Hr_attendance" AS attendance INNER JOIN app."Base_user" AS users ON attendance."userId" = users.id INNER JOIN app."Base_person" AS person ON users."personId" = person.id WHERE attendance.datetime AT TIME ZONE 'UTC' BETWEEN $1 AND $2 ORDER BY attendance.datetime DESC;`;
    const values = [initDates, endDates];

    const result = await pool.query(queryString, values);

    return result;
  } catch (error) {
    //console.error('Error al verificar la aceptación de términos:', error);
    return [
      {
        error:
          'No se conecto a la base de datos de la Aplicación de Macaciones',
      },
    ];
  }
};

const getQueryAppMarcacionesAll = async (startDate, endDate) => {
  try {
    //console.log('Fecha desde la base: ', startDate, endDate);
    const initDates = `${startDate} 00:00:00`;
    const endDates = `${endDate} 23:59:59`;
    const queryString = `SELECT  person.dni AS cedula, person.name AS nombre, 'Transferido - Aplicacion Movil' AS ubiBiometrico, TO_CHAR(attendance.datetime AT TIME ZONE 'UTC' AT TIME ZONE 'America/Guayaquil', 'DD/MM/YYYY HH24:MI:SS') AS fecha, attendance.states AS estado FROM app."Hr_attendance" AS attendance INNER JOIN app."Base_user" AS users ON attendance."userId" = users.id INNER JOIN app."Base_person" AS person ON users."personId" = person.id WHERE attendance.datetime AT TIME ZONE 'UTC' BETWEEN $1 AND $2 ORDER BY attendance.datetime DESC;`;
    const values = [initDates, endDates];

    const result = await pool.query(queryString, values);

    const rsltPGDB = processDataBiometrics(result?.rows);

    return rsltPGDB;
  } catch (error) {
    //console.error('Error al verificar la aceptación de términos:', error);
    return [
      {
        error:
          'No se conecto a la base de datos de la Aplicación de Macaciones',
      },
    ];
  }
};

const getQueryAppMarcacionesByDni = async (dni, startDate, endDate) => {
  try {
    const initDates = `${startDate} 00:00:00`;
    const endDates = `${endDate} 23:59:59`;
    const queryString = `SELECT  person.dni AS cedula, person.name AS nombre, 'Transferido - Aplicacion Movil' AS ubiBiometrico, TO_CHAR(attendance.datetime AT TIME ZONE 'UTC' AT TIME ZONE 'America/Guayaquil', 'DD/MM/YYYY HH24:MI:SS') AS fecha, attendance.states AS estado FROM app."Hr_attendance" AS attendance INNER JOIN app."Base_user" AS users ON attendance."userId" = users.id INNER JOIN app."Base_person" AS person ON users."personId" = person.id WHERE person.dni = $1 AND attendance.datetime AT TIME ZONE 'UTC' BETWEEN $2 AND $3 ORDER BY attendance.datetime DESC;`;
    const values = [dni, initDates, endDates];

    const result = await pool.query(queryString, values);

    return result.rows;
  } catch (error) {
    console.error('Error al verificar la aceptación de términos:', error);
    return [
      {
        error:
          'No se conecto a la base de datos de la Aplicación de Macaciones',
      },
    ];
  }
};

export const pgdb = {
  getQueryAppMarcaciones,
  getQueryAppMarcacionesByDni,
  getQueryAppMarcacionesAll,
};
