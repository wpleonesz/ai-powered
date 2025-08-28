import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Genera un token aleatorio
 * @param {number} length - Longitud del token
 * @returns {string} Token generado
 */
export const generateRandomToken = (length = 32) => {
  // Generar bytes aleatorios con crypto-js y convertir a hexadecimal
  const wordArray = CryptoJS.lib.WordArray.random(length);
  return wordArray.toString(CryptoJS.enc.Hex);
};

/**
 * Genera un JWT token
 * @param {object} payload - Datos a incluir en el token
 * @param {string} expiresIn - Tiempo de expiración (ej: '1h', '7d')
 * @returns {string} JWT token
 */
export const generateJWT = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verifica un JWT token
 * @param {string} token - Token a verificar
 * @returns {object} Payload del token decodificado
 */
export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

/**
 * Genera un token para reseteo de contraseña
 * @param {string} userId - ID del usuario
 * @returns {string} Token de reseteo
 */
export const generatePasswordResetToken = (userId) => {
  return generateJWT({ userId, type: 'password-reset' }, '1h');
};

/**
 * Verifica un token de reseteo de contraseña
 * @param {string} token - Token a verificar
 * @returns {object} Datos del token
 */
export const verifyPasswordResetToken = (token) => {
  const decoded = verifyJWT(token);
  if (decoded.type !== 'password-reset') {
    throw new Error('Tipo de token inválido');
  }
  return decoded;
};

const tokens = {
  generateRandomToken,
  generateJWT,
  verifyJWT,
  generatePasswordResetToken,
  verifyPasswordResetToken,
};

export default tokens;
