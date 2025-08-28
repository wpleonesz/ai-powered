import * as fs from 'fs';
import { hash } from '@lib/hash';
import path from 'path';

const ALLOWED = { image: ['png', 'jpeg'], application: ['pdf'] };

export const DEFAULT_IMAGE = '/assets/images/image_placeholder.png';

/** Retorna el base64 y el formato de un archivo */
const getFileParams = (file) => {
  try {
    const res = file.split(';base64,');
    const data = res[1];
    const format = res[0].split('data:')[1].split('/');
    const type = format[0];
    const extension = format[1];
    if (!ALLOWED[type].includes(extension))
      throw new Error(`Tipo de archivo ${extension} no permitido`);
    return [data, extension];
  } catch (error) {
    throw new Error(error.message || 'El archivo cargado no es correcto');
  }
};

/** Retorna el directorio en el cual se almacenarán los archivos, si no existe lo crea */
const getUploadDir = () => {
  const dir = `uploads`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  return dir;
};

/** Guarda un base64 como un archivo dentro de un directorio */
const saveOnDisk = (route, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(route, data, 'base64', (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
};

/** Almacena en disco una imagen
 * @param image Imagen a almacenar en `base64`
 * @param entity Entidad a la cual pertenece la imagen
 * @param field Campo de la entidad
 * @param recordId Registro al cual pertenece la imagen
 */
export const saveImage = async (image, entity, field, recordId) => {
  if (image !== null) {
    const [data, extension] = getFileParams(image);
    const filename = hash.create(`${entity}${field}${recordId}`, 'sha256');
    const dir = getUploadDir();
    const route = `${dir}/${filename}.${extension}`;
    await saveOnDisk(route, data);
    return `/api/public/images/${filename}.${extension}`;
  }
};

/** Almacena en disco una archivo
 * @param image Imagen a almacenar en `base64`
 * @param entity Entidad a la cual pertenece la imagen
 * @param field Campo de la entidad
 * @param recordId Registro al cual pertenece la imagen
 */
export const saveFile = async (image, entity, field, recordId) => {
  if (image !== null) {
    const [data, extension] = getFileParams(image);
    const filename = hash.create(`${entity}${field}${recordId}`, 'sha256');
    const dir = getUploadDir();
    const route = `${dir}/${filename}.${extension}`;
    await saveOnDisk(route, data);
    return `/api/public/files/${filename}.${extension}`;
  }
};

export const savePDF = async (filename, folder, subfolder, content) => {
  try {
    const uploadsPath = path.resolve(process.cwd(), 'uploads', folder);
    const subFolderPath = path.join(uploadsPath, subfolder);
    const filePath = path.join(subFolderPath, filename);

    // Verificar si la carpeta principal (folder) existe, si no, crearla
    if (!fs.existsSync(uploadsPath)) {
      await fs.promises.mkdir(uploadsPath, { recursive: true });
    }

    // Verificar si la subcarpeta (subfolder) existe, si no, crearla
    if (!fs.existsSync(subFolderPath)) {
      await fs.promises.mkdir(subFolderPath, { recursive: true });
    }

    // Verificar si el archivo ya existe, si es así, eliminarlo
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    // Escribir el nuevo archivo PDF
    await fs.promises.writeFile(filePath, content, 'base64');

    return filePath;
  } catch (error) {
    console.error('Error al guardar el archivo PDF:', error);
    throw error;
  }
};
