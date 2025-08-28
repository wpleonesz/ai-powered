const LANG = 'es-EC';
export const TIMEZONE = 'America/Guayaquil';

/** Retorna la fecha completa como string */
const getStringDateFull = () => {
  return new Date().toString(LANG, {
    timeZone: TIMEZONE,
  });
};

/** Retorna la fecha como string con los parámetros establecidos */
const parselocaleDateString = (params) => {
  return new Date().toLocaleDateString(LANG, {
    timeZone: TIMEZONE,
    ...params,
  });
};

/** Retorna el día de la semana como string */
const getStringWeekDay = () => {
  return parselocaleDateString({ weekday: 'long' });
};

/** Retorna el día, mes y año como string */
const getStringDate = () => {
  return parselocaleDateString({
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/** Retorna la hora, minutos y segundos como string*/
const getStringTime = () => {
  return parselocaleDateString({
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
};

/** Retorna la información de geoposición desde google
 * @param latitude Latitud
 * @param longitude Longitud

const googleMapsInfo = async (latitude, longitude) => {
  const key = process.env.GOOGLE_GPS_API_KEY;
  const response = await fetch(
    `${process.env.GOOGLE_GPS_API_URL}/geocode/json?latlng=${latitude},${longitude}&key=${key}&region=EC&language=es`,
  );
  return response.json();
};
 */

/** Retorna la información de geoposición del lugar más próximo desde google
 * @param latitude Latitud
 * @param longitude Longitud

const googleMapsPlace = async (latitude, longitude) => {
  const key = process.env.GOOGLE_GPS_API_KEY;
  const response = await fetch(
    `${process.env.GOOGLE_GPS_API_URL}/place/nearbysearch/json?location=` +
      `${latitude}%2C${longitude}&radius=100&key=${key}&region=EC&language=es`,
  );
  return response.json();
};
 */

/** Obtiene el nombre del lugar extraido de la respuesta del api place de google
const getName = async (place) => {
  return place.results[1]?.name || place.results[0]?.name;
};
*/
/** Obtiene el nombre de la ciudad extraida de la respuesta del api geocode de google
const getCity = async (info) => {
  return info.results[1]?.address_components[3]?.long_name;
};
*/
const getLocation = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener la ubicación: ', error);
    return null;
  }
};

const getCity = async (info) => {
  if (info) {
    let city = info?.address?.city;
    if (!city) {
      city = [
        info?.address?.amenity || info?.address?.country,
        info?.address?.town,
        info?.address?.county,
      ]
        .filter(Boolean)
        .join(', ');
    }
    if (city && info?.address?.state) {
      city += `, ${info?.address?.state}`;
    }
    return city || 'No localizado';
  } else {
    return 'No localizado';
  }
};

const getName = async (info, latitude, longitude) => {
  if (info) {
    return info?.display_name;
  } else {
    return `Localización por longitud y latitud: ${longitude} - ${latitude}`;
  }
};
/** Retorna un objeto con la descripción de la posición especificada mediante la latitud y longitud  */
//const info = await googleMapsInfo(latitude, longitude);
//const place = await googleMapsPlace(latitude, longitude);
//name: await getName(place),
//city: await getCity(info),
export const getPosition = async (latitude, longitude) => {
  const info = await getLocation(latitude, longitude);
  const name = await getName(info, latitude, longitude);
  const city = await getCity(info);
  const data = {
    name: name,
    city: city,
    weekday: getStringWeekDay(),
    date: getStringDate(),
    time: getStringTime(),
    dateFull: getStringDateFull(),
    latitude: latitude,
    longitude: longitude,
  };
  return data;
};
