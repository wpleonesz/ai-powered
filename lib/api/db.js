import mysql from 'mysql2';

const createDBPool = (data) => {
  const dbConfig = {
    host: data.host,
    user: data.user,
    password: data.password,
    database: data.name_db,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  };

  return mysql.createPool(dbConfig);
};

// Esta función obtiene una conexión del pool
const getConnectionFromPool = (pool) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err); // Manejo de errores
        return;
      }
      resolve(connection);
    });
  });
};

const executeQuery = async (pool, sql, values = []) => {
  let connection;
  try {
    connection = await getConnectionFromPool(pool);
    const results = await connection.promise().query(sql, values);
    const data = results[0];
    return data;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  } finally {
    if (connection) {
      connection.destroy();
    }
  }
};

const transformarResultados = (data, atributos) => {
  const emparejado = {};
  for (const atributo of atributos) {
    const dato = data[0][atributo.atributo];
    emparejado[atributo.atributo] = {
      text: atributo.text,
      value: dato,
    };
  }
  return emparejado;
};

export const db = {
  createDBPool,
  getConnectionFromPool,
  executeQuery,
  transformarResultados,
};
