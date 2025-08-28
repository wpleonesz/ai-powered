import CryptoJS from 'crypto-js';

/** Crea un hash de un texto especificado
 * @param text Texto del cual obtener el hash
 * @param algorithm Algoritmo a utilizar para el hash (Opcional)
 */

const create = (text, algorithm) => {
  const input = `${process.env.PASSWORD_SECRET || ''}${text}`;
  const algo = (
    algorithm ||
    process.env.HASH_ALGORITHM ||
    'sha256'
  ).toLowerCase();
  switch (algo) {
    case 'sha256':
      return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
    case 'sha1':
      return CryptoJS.SHA1(input).toString(CryptoJS.enc.Hex);
    case 'md5':
      return CryptoJS.MD5(input).toString(CryptoJS.enc.Hex);
    default:
      throw new Error(`Algoritmo de hash no soportado: ${algo}`);
  }
};

export const hash = { create };
