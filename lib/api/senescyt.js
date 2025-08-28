import axios from 'axios';
import xml2js from 'xml2js';

export const consultarRegistroNacional = async (codigoIes, identificacion) => {
  const wsdlUrl = process.env.URI_SENESCYT;
  const requestBody = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:swr="http://sw.registrounicoedusup.gob.ec:8080/SW-SNNA/SWRegistroNacional">
      <soap:Header/>
      <soap:Body>
        <swr:consultarRegistroNacional>
          <codigoIes>${codigoIes}</codigoIes>
          <identificacion>${identificacion}</identificacion>
        </swr:consultarRegistroNacional>
      </soap:Body>
    </soap:Envelope>
  `;

  const axiosOptions = {
    method: 'post',
    url: wsdlUrl,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
    },
    data: requestBody,
  };

  try {
    const response = await axios(axiosOptions);
    const xmlData = response.data;
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (error, result) => {
        if (error) {
          reject(error);
        } else {
          const registroNacional =
            result['soap:Envelope']['soap:Body'][0][
              'ns2:consultarRegistroNacionalResponse'
            ][0]['registroNacionalResponse'][0];

          // Modificar los valores para eliminar los corchetes []
          for (const key in registroNacional) {
            registroNacional[key] = registroNacional[key][0];
          }

          resolve(registroNacional);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

export const consultarRegistroNacional_PAA_OA = async (
  codigoIes,
  identificacion,
) => {
  const wsdlUrl = process.env.URI_SENESCYT;
  const requestBody = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:swr="http://sw.registrounicoedusup.gob.ec:8080/SW-SNNA/SWRegistroNacional">
      <soap:Header/>
      <soap:Body>
        <swr:consultarPAA_OA>
          <codigoIes>${codigoIes}</codigoIes>
          <identificacion>${identificacion}</identificacion>
        </swr:consultarPAA_OA>
      </soap:Body>
    </soap:Envelope>
  `;

  const axiosOptions = {
    method: 'post',
    url: wsdlUrl,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
    },
    data: requestBody,
  };

  try {
    const response = await axios(axiosOptions);
    const xmlData = response.data;
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (error, result) => {
        if (error) {
          reject(error);
        } else {
          const registroNacional_PAA_OA =
            result['soap:Envelope']['soap:Body'][0][
              'ns2:consultarPAA_OAResponse'
            ][0]['PAA_OA_Response'][0];

          // Modificar los valores para eliminar los corchetes []
          for (const key in registroNacional_PAA_OA) {
            registroNacional_PAA_OA[key] = registroNacional_PAA_OA[key][0];
          }

          resolve(registroNacional_PAA_OA);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};
