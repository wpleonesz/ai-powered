import axios from 'axios';
import xml2js from 'xml2js';
//import { validateDni } from '@helper/dni';

export const UEA_DIGERCIC_DEMOGRAFICO = async (identificacion) => {
  const wsdlUrl = process.env.URI_DINNARP;
  const username = process.env.USERNAME_DINNARP;
  const password = process.env.PASSWORD_DINNARP;
  const passcode = process.env.PASSCODE_DIGERCIC_DEMOGRAFICO;
  const authHeader =
    'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  const requestBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="http://interoperabilidad.dinardap.gob.ec/interoperador/">
    <soapenv:Header/>
    <soapenv:Body>
       <int:consultar>        
          <parametros>            
             <parametro>              
                <nombre>codigoPaquete</nombre>              
                <valor>${passcode}</valor>
             </parametro>
             <parametro>              
                <nombre>identificacion</nombre>              
                <valor>${identificacion}</valor>
             </parametro>                                         
          </parametros>
       </int:consultar>
    </soapenv:Body>
 </soapenv:Envelope>
    `;

  const axiosOptions = {
    method: 'post',
    url: wsdlUrl,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      Authorization: authHeader,
    },
    data: requestBody,
    timeout: 10000,
  };

  try {
    const response = await axios(axiosOptions);
    const xmlData = response.data;
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (error, result) => {
        if (error) {
          reject(error);
        } else {
          const filas =
            result['soap:Envelope']['soap:Body'][0]['ns2:consultarResponse'][0]
              .paquete[0].entidades[0].entidad[0].filas[0].fila;
          if (!filas || filas.length === 0) {
            // No se encontraron resultados, retornar un mensaje de error
            resolve([
              {
                error:
                  'No se encontraron resultados para la identificación proporcionada',
              },
            ]);
          } else {
            // Crear un arreglo para almacenar los objetos JSON de cada fila
            const jsonResultArray = [];

            for (const fila of filas) {
              const columnas = fila.columnas[0].columna;
              const jsonResult = {};

              for (const item of columnas) {
                const campo = item.campo[0];
                const valor = item.valor[0];
                jsonResult[campo] = valor;
              }

              jsonResultArray.push(jsonResult);
            }

            resolve(jsonResultArray);
          }
        }
      });
    });
  } catch (error) {
    if (error.isAxiosError) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 500) {
          let faultString, faultMessageUser, timeStamp;
          xml2js.parseString(error.response.data, (err, result) => {
            if (err) {
              console.error('Error parsing XML:', err);
              return [
                {
                  error: 'Error al analizar la respuesta SOAP',
                },
              ];
            }

            // Extract fault details
            faultString =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'faultstring'
              ][0];
            faultMessageUser =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'detail'
              ][0]['ns2:consultarFault'][0]['faultMessageUser'][0];
            timeStamp =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'detail'
              ][0]['ns2:consultarFault'][0]['timeStamp'][0];
          });
          return [
            {
              error: `${faultString.toUpperCase()}: ${faultMessageUser} (${timeStamp})`,
            },
          ];
        } else {
          return [
            {
              error: `Error (${statusCode}): La fuente no está proporcionando datos en este momento. Por favor, inténtelo de nuevo más tarde.`,
            },
          ];
        }
      } else if (error.request) {
        return [
          {
            error: 'La solicitud no obtuvo respuesta',
          },
        ];
      } else {
        return [
          {
            error: 'Error en la configuración de la solicitud',
          },
        ];
      }
    } else {
      return [
        {
          error: `Error no relacionado con Axios: ${error.message}`,
        },
      ];
    }
  }
};

export const UEA_DIGERCIC_BIOMETRICO = async (identificacion) => {
  const wsdlUrl = process.env.URI_DINNARP;
  const username = process.env.USERNAME_DINNARP;
  const password = process.env.PASSWORD_DINNARP;
  const passcode = process.env.PASSCODE_DIGERCIC_BIOMETRICO;
  const authHeader =
    'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  const requestBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="http://interoperabilidad.dinardap.gob.ec/interoperador/">
      <soapenv:Header/>
      <soapenv:Body>
         <int:consultar>        
            <parametros>            
               <parametro>              
                  <nombre>codigoPaquete</nombre>              
                  <valor>${passcode}</valor>
               </parametro>
               <parametro>              
                  <nombre>identificacion</nombre>              
                  <valor>${identificacion}</valor>
               </parametro>                                         
            </parametros>
         </int:consultar>
      </soapenv:Body>
   </soapenv:Envelope>
      `;

  const axiosOptions = {
    method: 'post',
    url: wsdlUrl,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      Authorization: authHeader,
    },
    data: requestBody,
    timeout: 10000,
  };

  try {
    const response = await axios(axiosOptions);
    const xmlData = response.data;
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (error, result) => {
        if (error) {
          reject(error);
        } else {
          const filas =
            result['soap:Envelope']['soap:Body'][0]['ns2:consultarResponse'][0]
              .paquete[0].entidades[0].entidad[0].filas[0].fila;
          if (!filas || filas.length === 0) {
            // No se encontraron resultados, retornar un mensaje de error
            resolve([
              {
                error:
                  'No se encontraron resultados para la identificación proporcionada',
              },
            ]);
          } else {
            // Crear un arreglo para almacenar los objetos JSON de cada fila
            const jsonResultArray = [];

            for (const fila of filas) {
              const columnas = fila.columnas[0].columna;
              const jsonResult = {};

              for (const item of columnas) {
                const campo = item?.campo[0];
                const valor = item?.valor[0] || null;
                jsonResult[campo] = valor;
              }

              jsonResultArray.push(jsonResult);
            }

            resolve(jsonResultArray);
          }
        }
      });
    });
  } catch (error) {
    if (error.isAxiosError) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 500) {
          let faultString, faultMessageUser, timeStamp;
          xml2js.parseString(error.response.data, (err, result) => {
            if (err) {
              console.error('Error parsing XML:', err);
              return [
                {
                  error: 'Error al analizar la respuesta SOAP',
                },
              ];
            }

            // Extract fault details
            faultString =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'faultstring'
              ][0];
            faultMessageUser =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'detail'
              ][0]['ns2:consultarFault'][0]['faultMessageUser'][0];
            timeStamp =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'detail'
              ][0]['ns2:consultarFault'][0]['timeStamp'][0];
          });
          return [
            {
              error: `${faultString.toUpperCase()}: ${faultMessageUser} (${timeStamp})`,
            },
          ];
        } else {
          return [
            {
              error: `Error (${statusCode}): La fuente no está proporcionando datos en este momento. Por favor, inténtelo de nuevo más tarde.`,
            },
          ];
        }
      } else if (error.request) {
        return [
          {
            error: 'La solicitud no obtuvo respuesta',
          },
        ];
      } else {
        return [
          {
            error: 'Error en la configuración de la solicitud',
          },
        ];
      }
    } else {
      return [
        {
          error: `Error no relacionado con Axios: ${error.message}`,
        },
      ];
    }
  }
};

export const UEA_MINEDUC = async (identificacion) => {
  const wsdlUrl = process.env.URI_DINNARP;
  const username = process.env.USERNAME_DINNARP;
  const password = process.env.PASSWORD_DINNARP;
  const passcode = process.env.PASSCODE_MINEDUC;
  const authHeader =
    'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  const requestBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="http://interoperabilidad.dinardap.gob.ec/interoperador/">
    <soapenv:Header/>
    <soapenv:Body>
       <int:consultar>        
          <parametros>            
             <parametro>              
                <nombre>codigoPaquete</nombre>              
                <valor>${passcode}</valor>
             </parametro>
             <parametro>              
                <nombre>identificacion</nombre>              
                <valor>${identificacion}</valor>
             </parametro>                                         
          </parametros>
       </int:consultar>
    </soapenv:Body>
 </soapenv:Envelope>
    `;

  const axiosOptions = {
    method: 'post',
    url: wsdlUrl,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      Authorization: authHeader,
    },
    data: requestBody,
    timeout: 10000,
  };

  try {
    const response = await axios(axiosOptions);
    const xmlData = response.data;
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (error, result) => {
        if (error) {
          reject(error);
        } else {
          const filas =
            result['soap:Envelope']['soap:Body'][0]['ns2:consultarResponse'][0]
              .paquete[0].entidades[0].entidad[0].filas[0].fila;

          if (!filas || filas.length === 0) {
            // No se encontraron resultados, retornar un mensaje de error
            resolve([
              {
                error:
                  'No se encontraron resultados para la identificación proporcionada',
              },
            ]);
          } else {
            // Crear un arreglo para almacenar los objetos JSON de cada fila
            const jsonResultArray = [];

            for (const fila of filas) {
              const columnas = fila.columnas[0].columna;
              const jsonResult = {};

              for (const item of columnas) {
                const campo = item.campo[0];
                const valor = item.valor[0] || null;
                jsonResult[campo] = valor;
              }

              jsonResultArray.push(jsonResult);
            }

            resolve(jsonResultArray);
          }
        }
      });
    });
  } catch (error) {
    if (error.isAxiosError) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 500) {
          let faultString, faultMessageUser, timeStamp;
          xml2js.parseString(error.response.data, (err, result) => {
            if (err) {
              console.error('Error parsing XML:', err);
              return [
                {
                  error: 'Error al analizar la respuesta SOAP',
                },
              ];
            }

            // Extract fault details
            faultString =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'faultstring'
              ][0];
            faultMessageUser =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'detail'
              ][0]['ns2:consultarFault'][0]['faultMessageUser'][0];
            timeStamp =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'detail'
              ][0]['ns2:consultarFault'][0]['timeStamp'][0];
          });
          return [
            {
              error: `${faultString.toUpperCase()}: ${faultMessageUser} (${timeStamp})`,
            },
          ];
        } else {
          return [
            {
              error: `Error (${statusCode}): La fuente no está proporcionando datos en este momento. Por favor, inténtelo de nuevo más tarde.`,
            },
          ];
        }
      } else if (error.request) {
        return [
          {
            error: 'La solicitud no obtuvo respuesta',
          },
        ];
      } else {
        return [
          {
            error: 'Error en la configuración de la solicitud',
          },
        ];
      }
    } else {
      return [
        {
          error: `Error no relacionado con Axios: ${error.message}`,
        },
      ];
    }
  }
};

export const UEA_SENESCYT = async (identificacion) => {
  const wsdlUrl = process.env.URI_DINNARP;
  const username = process.env.USERNAME_DINNARP;
  const password = process.env.PASSWORD_DINNARP;
  const passcode = process.env.PASSCODE_SENESCYT;
  const authHeader =
    'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  const requestBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="http://interoperabilidad.dinardap.gob.ec/interoperador/">
    <soapenv:Header/>
    <soapenv:Body>
       <int:consultar>        
          <parametros>            
             <parametro>              
                <nombre>codigoPaquete</nombre>              
                <valor>${passcode}</valor>
             </parametro>
             <parametro>              
                <nombre>identificacion</nombre>              
                <valor>${identificacion}</valor>
             </parametro>                                         
          </parametros>
       </int:consultar>
    </soapenv:Body>
 </soapenv:Envelope>
    `;

  const axiosOptions = {
    method: 'post',
    url: wsdlUrl,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      Authorization: authHeader,
    },
    data: requestBody,
    timeout: 10000,
  };

  try {
    const response = await axios(axiosOptions);
    const xmlData = response.data;
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (error, result) => {
        if (error) {
          reject(error);
        } else {
          const filas =
            result['soap:Envelope']['soap:Body'][0]['ns2:consultarResponse'][0]
              .paquete[0].entidades[0].entidad[0].filas[0].fila;

          if (!filas || filas.length === 0) {
            // No se encontraron resultados, retornar un mensaje de error
            resolve([
              {
                error:
                  'No se encontraron resultados para la identificación proporcionada',
              },
            ]);
          } else {
            // Crear un arreglo para almacenar los objetos JSON de cada fila
            const jsonResultArray = [];

            for (const fila of filas) {
              const columnas = fila.columnas[0].columna;
              const jsonResult = {};

              for (const item of columnas) {
                const campo = item.campo[0];
                const valor = item.valor[0] || null;
                jsonResult[campo] = valor;
              }

              jsonResultArray.push(jsonResult);
            }

            resolve(jsonResultArray);
          }
        }
      });
    });
  } catch (error) {
    if (error.isAxiosError) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 500) {
          let faultString, faultMessageUser, timeStamp;
          xml2js.parseString(error.response.data, (err, result) => {
            if (err) {
              console.error('Error parsing XML:', err);
              return [
                {
                  error: 'Error al analizar la respuesta SOAP',
                },
              ];
            }

            // Extract fault details
            faultString =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'faultstring'
              ][0];
            faultMessageUser =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'detail'
              ][0]['ns2:consultarFault'][0]['faultMessageUser'][0];
            timeStamp =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'detail'
              ][0]['ns2:consultarFault'][0]['timeStamp'][0];
          });
          return [
            {
              error: `${faultString.toUpperCase()}: ${faultMessageUser} (${timeStamp})`,
            },
          ];
        } else {
          return [
            {
              error: `Error (${statusCode}): La fuente no está proporcionando datos en este momento. Por favor, inténtelo de nuevo más tarde.`,
            },
          ];
        }
      } else if (error.request) {
        return [
          {
            error: 'La solicitud no obtuvo respuesta',
          },
        ];
      } else {
        return [
          {
            error: 'Error en la configuración de la solicitud',
          },
        ];
      }
    } else {
      return [
        {
          error: `Error no relacionado con Axios: ${error.message}`,
        },
      ];
    }
  }
};

export const UEA_CNE = async (identificacion) => {
  const wsdlUrl = process.env.URI_DINNARP;
  const username = process.env.USERNAME_DINNARP;
  const password = process.env.PASSWORD_DINNARP;
  const passcode = process.env.PASSCODE_CNE;
  const authHeader =
    'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  const requestBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="http://interoperabilidad.dinardap.gob.ec/interoperador/">
    <soapenv:Header/>
    <soapenv:Body>
       <int:consultar>        
          <parametros>            
             <parametro>              
                <nombre>codigoPaquete</nombre>              
                <valor>${passcode}</valor>
             </parametro>
             <parametro>              
                <nombre>identificacion</nombre>              
                <valor>${identificacion}</valor>
             </parametro>                                         
          </parametros>
       </int:consultar>
    </soapenv:Body>
 </soapenv:Envelope>
    `;

  const axiosOptions = {
    method: 'post',
    url: wsdlUrl,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      Authorization: authHeader,
    },
    data: requestBody,
    timeout: 10000,
  };

  try {
    const response = await axios(axiosOptions);
    const xmlData = response.data;
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, (error, result) => {
        if (error) {
          reject(error);
        } else {
          const filas =
            result['soap:Envelope']['soap:Body'][0]['ns2:consultarResponse'][0]
              .paquete[0].entidades[0].entidad[0].filas[0].fila;
          if (!filas || filas.length === 0) {
            // No se encontraron resultados, retornar un mensaje de error
            resolve([
              {
                error:
                  'No se encontraron resultados para la identificación proporcionada',
              },
            ]);
          } else {
            // Crear un arreglo para almacenar los objetos JSON de cada fila
            const jsonResultArray = [];

            for (const fila of filas) {
              const columnas = fila.columnas[0].columna;
              const jsonResult = {};

              for (const item of columnas) {
                const campo = item.campo[0];
                const valor = item.valor[0] || null;
                jsonResult[campo] = valor;
              }

              jsonResultArray.push(jsonResult);
            }

            resolve(jsonResultArray);
          }
        }
      });
    });
  } catch (error) {
    if (error.isAxiosError) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 500) {
          let faultString, faultMessageUser, timeStamp;
          xml2js.parseString(error.response.data, (err, result) => {
            if (err) {
              console.error('Error parsing XML:', err);
              return [
                {
                  error: 'Error al analizar la respuesta SOAP',
                },
              ];
            }

            // Extract fault details
            faultString =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'faultstring'
              ][0];
            faultMessageUser =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'detail'
              ][0]['ns2:consultarFault'][0]['faultMessageUser'][0];
            timeStamp =
              result['soap:Envelope']['soap:Body'][0]['soap:Fault'][0][
                'detail'
              ][0]['ns2:consultarFault'][0]['timeStamp'][0];
          });
          return [
            {
              error: `${faultString.toUpperCase()}: ${faultMessageUser} (${timeStamp})`,
            },
          ];
        } else {
          return [
            {
              error: `Error (${statusCode}): La fuente no está proporcionando datos en este momento. Por favor, inténtelo de nuevo más tarde.`,
            },
          ];
        }
      } else if (error.request) {
        return [
          {
            error: 'La solicitud no obtuvo respuesta',
          },
        ];
      } else {
        return [
          {
            error: 'Error en la configuración de la solicitud',
          },
        ];
      }
    } else {
      return [
        {
          error: `Error no relacionado con Axios: ${error.message}`,
        },
      ];
    }
  }
};
