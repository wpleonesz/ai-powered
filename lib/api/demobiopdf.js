import {
  UEA_DIGERCIC_DEMOGRAFICO,
  UEA_DIGERCIC_BIOMETRICO,
  UEA_CNE,
  UEA_MINEDUC,
  UEA_SENESCYT,
} from '@lib/api/dinnarp';
import {
  generatePDFDemobioSIAD,
  generatePDFCneSIAD,
  generatePDFMineducSIAD,
  generatePDFSenescytSIAD,
} from '@lib/pdf/demobiopdf';
import LogQueryData from '@database/audit/query';
import DocumentData from '@database/audit/document';
import TokensData from '@database/base/tokens';
import { verifyToken } from '@lib/api/tokens';
import { savePDF } from '@lib/api/files';

export const validateToken = async (res, tokenValue) => {
  const tokenAuth = new TokensData();
  const token = await tokenAuth
    .select({ id: true, token: true, name: true })
    .where({
      token: tokenValue,
    })
    .getFirst();

  if (!token || !verifyToken(token?.token)) {
    return res.json([{ error: 'Token no válido' }]);
  }
  return token;
};

export const getStoredLog = async (identificacion, method) => {
  const query = new LogQueryData();
  return await query
    .select({ id: true, dni: true, response: true, timestamp: true })
    .where({
      dni: identificacion,
      method: method,
    })
    .getFirst();
};

export const getDocumentLog = async (identificacion, type) => {
  const pdf = new DocumentData();
  return await pdf
    .select({ dni: true, name: true, url: true, values: true, createdAt: true })
    .where({
      dni: identificacion,
      url: {
        not: null,
      },
      type: type,
    })
    .orderBy({ createdAt: 'desc' })
    .getFirst();
};

export const fetchData = async (identificacion) => {
  try {
    const [res1, res2] = await Promise.all([
      UEA_DIGERCIC_DEMOGRAFICO(identificacion),
      UEA_DIGERCIC_BIOMETRICO(identificacion),
    ]);
    if (res1[0].error || res2[0].error) {
      return [
        {
          error: res1[0].error || res2[0].error,
        },
      ];
    }
    return [{ ...res1[0], ...res2[0] }];
  } catch (error) {
    return [
      {
        error: error,
      },
    ];
  }
};

export const generatePDF = async (data, nametoken) => {
  try {
    const pdfDemoBio = await generatePDFDemobioSIAD(data, nametoken);
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `documento_${currentDate}_${data?.cedula}.pdf`;
    await savePDF(filename, 'dinnarp', 'demografico', pdfDemoBio);
    const publicURL = `${process.env.BASE_URL}/api/public/files/dinarp/demografico/${filename}`;
    return [
      {
        cedula: data?.cedula,
        nombres: data?.nombre,
        url: publicURL,
        pdf: pdfDemoBio,
        saved: true,
      },
    ];
  } catch (error) {
    console.error('Error al generar o guardar el archivo PDF:', error);
  }
};

export const generatePDFCne = async (data, nametoken) => {
  try {
    const pdfDemoBio = await generatePDFCneSIAD(data, nametoken);
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `documento_${currentDate}_${data?.cedula}.pdf`;
    await savePDF(filename, 'dinnarp', 'cne', pdfDemoBio);
    const publicURL = `${process.env.BASE_URL}/api/public/files/dinarp/cne/${filename}`;
    return [
      {
        cedula: data?.cedula,
        nombres: data?.nombre,
        habilitadoTPublico: data?.habilitadoTPublico,
        url: publicURL,
        pdf: pdfDemoBio,
        saved: true, // Indicador booleano de si se ha guardado el archivo correctamente
      },
    ];
  } catch (error) {
    console.error('Error al generar o guardar el archivo PDF:', error);
  }
};

export const fetchDataCne = async (identificacion) => {
  try {
    const [res1, res2] = await Promise.all([
      UEA_CNE(identificacion),
      UEA_DIGERCIC_BIOMETRICO(identificacion),
    ]);
    if (res1[0].error || res2[0].error) {
      return [
        {
          error: res1[0].error || res2[0].error,
        },
      ];
    }
    return [{ ...res1[0], ...res2[0] }];
  } catch (error) {
    return [
      {
        error: error,
      },
    ];
  }
};

export const generatePDFMineduc = async (data, nametoken) => {
  try {
    const pdfDemoBio = await generatePDFMineducSIAD(data, nametoken);
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `documento_${currentDate}_${data?.cedula}.pdf`;
    await savePDF(filename, 'dinnarp', 'mineduc', pdfDemoBio);
    const publicURL = `${process.env.BASE_URL}/api/public/files/dinarp/mineduc/${filename}`;
    return [
      {
        cedula: data?.cedula,
        nombres: data?.nombre,
        titulo: data?.titulo?.toLowerCase(),
        url: publicURL,
        pdf: pdfDemoBio,
        saved: true, // Indicador booleano de si se ha guardado el archivo correctamente
      },
    ];
  } catch (error) {
    console.error('Error al generar o guardar el archivo PDF:', error);
  }
};

export const fetchDataMineduc = async (identificacion) => {
  try {
    const [res1, res2] = await Promise.all([
      UEA_MINEDUC(identificacion),
      UEA_DIGERCIC_BIOMETRICO(identificacion),
    ]);
    if (res1[0].error || res2[0].error) {
      return [
        {
          error: res1[0].error || res2[0].error,
        },
      ];
    }
    return [{ ...res1[0], ...res2[0] }];
  } catch (error) {
    return [
      {
        error: error,
      },
    ];
  }
};

export const generatePDFSenescyt = async (data, dni, nametoken) => {
  try {
    const pdfDemoBio = await generatePDFSenescytSIAD(data, nametoken);
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `documento_${currentDate}_${dni}.pdf`;
    await savePDF(filename, 'dinnarp', 'senescyt', pdfDemoBio);
    const publicURL = `${process.env.BASE_URL}/api/public/files/dinarp/senescyt/${filename}`;
    return [
      {
        cedula: dni,
        url: publicURL,
        pdf: pdfDemoBio,
        saved: true, // Indicador booleano de si se ha guardado el archivo correctamente
      },
    ];
  } catch (error) {
    console.error('Error al generar o guardar el archivo PDF:', error);
  }
};

export const fetchDataSenescyt = async (identificacion) => {
  try {
    const [res1, res2] = await Promise.all([
      UEA_SENESCYT(identificacion),
      UEA_DIGERCIC_BIOMETRICO(identificacion),
    ]);

    if (res1[0].error || res2[0].error) {
      return [
        {
          error: res1[0].error || res2[0].error,
        },
      ];
    }
    return [{ titulos: res1, ...res2[0] }];
  } catch (error) {
    return [
      {
        error: error,
      },
    ];
  }
};
