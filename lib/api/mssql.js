import sql from 'mssql';
import { processDataBiometrics } from '@helper/api/biometrics';

// Configuración de la conexión
const config = {
  user: process.env.USER_SQL_SERVER,
  password: process.env.PASSW_SQL_SERVER,
  server: process.env.HOST_SQL_SERVER,
  database: process.env.NAMEDB_SQL_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};
const getConnectionFromPool = async () => {
  try {
    const connection = await sql.connect(config);
    return connection;
  } catch (err) {
    console.log(err);
    throw err; // Manejo de errores
  }
};

const getQueryBioMarcaciones = async (startDate, endDate) => {
  let connection;
  try {
    connection = await getConnectionFromPool();
    const initDates = `${startDate} 00:00:00`;
    const endDates = `${endDate} 23:59:59`;
    const result = await connection.query(
      `SELECT  users.SSN AS cedula, CONCAT(users.sca_Apellido, ' ', users.sca_Nombre) AS nombre, machiness.MachineAlias AS ubibiometrico, FORMAT(chinout.CHECKTIME, 'dd/MM/yyyy HH:mm:ss') AS fecha, CASE WHEN CAST(chinout.CHECKTIME AS TIME) >= '00:00:00' AND CAST(chinout.CHECKTIME AS TIME) <= '10:00:00' THEN 'start' WHEN CAST(chinout.CHECKTIME AS TIME) > '10:00:00' AND CAST(chinout.CHECKTIME AS TIME) <= '12:50:00' THEN 'stop' WHEN CAST(chinout.CHECKTIME AS TIME) > '12:50:00' AND CAST(chinout.CHECKTIME AS TIME) <= '13:33:00' THEN 'reset' WHEN CAST(chinout.CHECKTIME AS TIME) > '13:33:00' AND CAST(chinout.CHECKTIME AS TIME) <= '23:59:59' THEN 'end' ELSE 'stateless' END AS estado FROM CHECKINOUT AS chinout LEFT JOIN CHECKEXACT AS chexact ON chinout.USERID = chexact.USERID INNER JOIN USERINFO AS users ON chinout.USERID = users.USERID INNER JOIN MACHINES AS machiness ON chinout.sn = machiness.sn WHERE chinout.CHECKTIME BETWEEN '${initDates}' AND '${endDates}' GROUP BY chinout.CHECKTIME, users.SSN, users.sca_Nombre, users.sca_Apellido, machiness.MachineAlias ORDER BY chinout.CHECKTIME ASC`,
    );

    return result.recordset;
  } catch (error) {
    //console.error('Error al ejecutar la consulta:', error);
    return [
      {
        error: 'No se conecto a la base de datos del Biométrico',
      },
    ];
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

const getQueryBioMarcacionesAll = async (startDate, endDate) => {
  let connection;
  try {
    connection = await getConnectionFromPool();
    const initDates = `${startDate} 00:00:00`;
    const endDates = `${endDate} 23:59:59`;
    const result = await connection.query(
      `SELECT  users.SSN AS cedula, CONCAT(users.sca_Apellido, ' ', users.sca_Nombre) AS nombre, machiness.MachineAlias AS ubibiometrico, FORMAT(chinout.CHECKTIME, 'dd/MM/yyyy HH:mm:ss') AS fecha, 'stateless' AS estado FROM CHECKINOUT AS chinout LEFT JOIN CHECKEXACT AS chexact ON chinout.USERID = chexact.USERID INNER JOIN USERINFO AS users ON chinout.USERID = users.USERID INNER JOIN MACHINES AS machiness ON chinout.sn = machiness.sn WHERE chinout.CHECKTIME BETWEEN '${initDates}' AND '${endDates}' GROUP BY chinout.CHECKTIME, users.SSN, users.sca_Nombre, users.sca_Apellido, machiness.MachineAlias ORDER BY chinout.CHECKTIME ASC`,
    );
    //console.log(result.recordset);
    const rsltMSDB = processDataBiometrics(result.recordset);
    return rsltMSDB;
  } catch (error) {
    //console.error('Error al ejecutar la consulta:', error);
    return [
      {
        error: 'No se conecto a la base de datos del Biométrico',
      },
    ];
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

const getQueryBioMarcacionesByDni = async (dni, startDate, endDate) => {
  let connection;
  try {
    connection = await getConnectionFromPool();
    const initDates = `${startDate} 00:00:00`;
    const endDates = `${endDate} 23:59:59`;
    const result = await connection.query(
      `SELECT  users.SSN AS cedula, CONCAT(users.sca_Apellido, ' ', users.sca_Nombre) AS nombre, machiness.MachineAlias AS ubibiometrico, FORMAT(chinout.CHECKTIME, 'dd/MM/yyyy HH:mm:ss') AS fecha, 'stateless' AS estado FROM CHECKINOUT AS chinout LEFT JOIN CHECKEXACT AS chexact ON chinout.USERID = chexact.USERID INNER JOIN USERINFO AS users ON chinout.USERID = users.USERID INNER JOIN MACHINES AS machiness ON chinout.sn = machiness.sn WHERE users.SSN = '${dni}' AND chinout.CHECKTIME BETWEEN '${initDates}' AND '${endDates}' GROUP BY chinout.CHECKTIME, users.SSN, users.sca_Nombre, users.sca_Apellido, machiness.MachineAlias ORDER BY chinout.CHECKTIME ASC`,
    );
    return result.recordset;
  } catch (error) {
    //console.error('Error al ejecutar la consulta:', error);
    return [
      {
        error: 'No se conecto a la base de datos del Biométrico',
      },
    ];
  } finally {
    if (connection) {
      connection.close();
    }
  }
};

const createDBPool = (data) => {
  const dbConfig = {
    user: data.user,
    password: data.password,
    server: data.host.split(',')[0], // Extrae la IP del host
    port: parseInt(data.host.split(',')[1]), // Extrae el puerto del host y conviértelo a número
    database: data.name_db,
    pool: {
      max: 10, // Número máximo de conexiones en el pool
      min: 0, // Número mínimo de conexiones en el pool
      idleTimeoutMillis: 60000, // Tiempo de espera antes de cerrar una conexión inactiva
    },
    options: {
      encrypt: false, // Usa true si estás en Azure
      enableArithAbort: true,
      trustServerCertificate: true, // Necesario si usas SSL
    },
  };

  return new sql.ConnectionPool(dbConfig).connect();
};

const executeQuery = async (pool, query, params) => {
  try {
    const request = pool.request();
    if (params) {
      Object.keys(params).forEach((key) => {
        request.input(key, params[key]);
      });
    }
    console.log(query);
    const result = await request.query(query);
    console.log('Consulta exitosa:', result);
    return result.recordset;
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
  }
};

export const msdb = {
  getConnectionFromPool,
  getQueryBioMarcaciones,
  getQueryBioMarcacionesByDni,
  getQueryBioMarcacionesAll,
  createDBPool,
  executeQuery,
};
