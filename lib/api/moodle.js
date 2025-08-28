/* eslint-disable @next/next/no-assign-module-variable */
import axios from 'axios';
import { moodleService } from '@services/moodle.service';
import { dates } from '@lib/dates';

const parseCourseShortname = (resultados) => {
  const course = resultados?.courses[0]; // Tomamos solo el primer curso, ajusta según sea necesario
  return {
    id: course?.id,
    name: course?.fullname,
    shortname: course?.shortname,
    categoryid: course?.categoryid,
    categoryname: course?.categoryname,
    idnumber: course?.idnumber,
    teachername: course?.contacts[0]?.fullname,
    teacherid: course?.contacts[0]?.id,
  };
};

const parseHandlerSIAD = (rows, instanceid) => {
  return rows.map((row) => {
    return {
      attendanceid: instanceid,
      description: 'Clase Encuentro (CE)',
      sessiontime: dates.getFormatMoodle(row?.ps_fecha, row?.ps_hora_ini),
      duration: row?.ps_horas * 3600,
      groupid: 0,
      addcalendarevent: 1,
    };
  });
};

export const searchCourseShortname = async (uri, token, shortname) => {
  try {
    const response = await axios.post(uri, null, {
      params: {
        wstoken: token,
        wsfunction: 'core_course_get_courses_by_field',
        moodlewsrestformat: 'json',
        field: 'shortname',
        value: shortname,
      },
    });
    if (response.data?.courses.length <= 0) {
      return { error: 'No se encontro el curso' };
    } else {
      const parsedData = parseCourseShortname(response?.data);
      return parsedData;
    }
  } catch (error) {
    return { error: 'Error al buscar el curso por nombre corto' };
  }
};

export const getAttendanceSessions = async (uri, token, instanceId) => {
  try {
    const response = await axios.post(uri, null, {
      params: {
        wstoken: token,
        wsfunction: 'mod_attendance_get_sessions',
        moodlewsrestformat: 'json',
        attendanceid: instanceId, // ID de la instancia de la actividad de asistencia
      },
    });

    const sessions = response.data.map((session) => ({
      description: session.description,
      sessdate: session.sessdate,
      duration: session.duration,
      sessionid: session.id,
      attendanceLogs: session.attendance_log,
    }));
    if (sessions) {
      return sessions;
    } else {
      return { error: 'Error al obtener las sesiones de asistencia' };
    }
  } catch (error) {
    return { error: 'Error al obtener las sesiones de asistencia' };
  }
};

export const searchCourseAssistance = async (uri, token, idcourse) => {
  try {
    const response = await axios.post(uri, null, {
      params: {
        wstoken: token,
        wsfunction: 'core_course_get_contents',
        moodlewsrestformat: 'json',
        courseid: idcourse,
      },
    });

    // Buscar todos los módulos de asistencia si están presentes
    const assistanceModules = [];
    for (const section of response.data) {
      const assistance = section.modules.filter(
        (modulo) => modulo.modname === 'attendance',
      );
      if (assistance.length > 0) {
        for (const module of assistance) {
          const { id, name, instance } = module;
          const sessions = await getAttendanceSessions(uri, token, instance);
          assistanceModules.push({ id, name, instance, sessions });
        }
      }
    }

    if (assistanceModules.length > 0) {
      return { hasAssistance: true, assistanceModules };
    } else {
      return {
        error: 'Error al buscar la actividad de asistencia en el curso',
      };
    }
  } catch (error) {
    return { error: 'Error al buscar la actividad de asistencia en el curso' };
  }
};

export const addAttendanceSession = async (uri, token, sessionDetails) => {
  // Función que retorna una promesa que se resuelve después de 2 segundos
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    let jsonObjectDetails = JSON.parse(sessionDetails);

    // Espera de 2 segundos antes de realizar la petición
    await delay(1000);

    const response = await axios.post(uri, null, {
      params: {
        wstoken: token,
        wsfunction: 'mod_attendance_add_session',
        moodlewsrestformat: 'json',
        attendanceid: jsonObjectDetails?.attendanceid,
        description: jsonObjectDetails?.description,
        sessiontime: jsonObjectDetails?.sessiontime,
        duration: jsonObjectDetails?.duration,
        groupid: jsonObjectDetails?.groupid,
        addcalendarevent: jsonObjectDetails?.addcalendarevent,
      },
    });

    // Verificar si la sesión fue agregada correctamente
    if (response.data) {
      if (response.data.errorcode) {
        return {
          error:
            response.data.message ||
            'Error desconocido al agregar la sesión de asistencia',
        };
      } else if (response.data.sessionid) {
        return response.data.sessionid; // Retorna el ID de la sesión creada
      } else {
        return { error: 'Respuesta inesperada del servidor' };
      }
    } else {
      return { error: 'No se recibió respuesta del servidor' };
    }
  } catch (error) {
    return { error: 'Error al agregar la sesión de asistencia' };
  }
};

export const removeSession = async (uri, token, sessionid) => {
  try {
    const response = await axios.post(uri, null, {
      params: {
        wstoken: token,
        wsfunction: 'mod_attendance_remove_session',
        moodlewsrestformat: 'json',
        sessionid: sessionid,
      },
    });

    // Verificar si la sesión fue agregada correctamente
    if (response.data) {
      return response.data; // Retorna el ID de la sesión creada
    } else {
      return { error: 'Error al eliminar la sesión de asistencia' };
    }
  } catch (error) {
    return { error: 'Error al eliminar la sesión de asistencia' };
  }
};

export const transferAssitence = async (
  instance,
  sessionsSiad,
  sessionsMoodle,
  idmoodle,
) => {
  try {
    const parsedSiad = parseHandlerSIAD(sessionsSiad, instance);

    if (sessionsMoodle.length === 0) {
      // Paso 1: Si sessionsMoodle está vacío, añadir todas las sesiones de parsedSiad

      for (const siadSession of parsedSiad) {
        const regSession = await moodleService.getAddBySessions(
          idmoodle,
          JSON.stringify(siadSession),
        );

        console.log(regSession);
      }
      return { message: 'Transferido' };
    } else {
      // Paso 2: Verificar si parsedSiad es igual a sessionsMoodle
      let isDifferent = false;
      for (const siadSession of parsedSiad) {
        const matchingSession = sessionsMoodle.find(
          (moodleSession) => moodleSession.sessdate === siadSession.sessiontime,
        );
        if (!matchingSession) {
          isDifferent = true;
          break;
        }
      }
      // Paso 3: Si existe alguna diferencia, eliminar las sesiones diferentes y añadir las de parsedSiad
      if (isDifferent) {
        // Eliminar sesiones diferentes en sessionsMoodle
        for (const moodleSession of sessionsMoodle) {
          if (
            !parsedSiad.some(
              (siadsession) =>
                siadsession.sessiontime === moodleSession.sessdate,
            )
          ) {
            const attendanceLogs = moodleSession.attendanceLogs;
            if (attendanceLogs.length === 0) {
              // Solo eliminar si attendanceLogs es cero
              await moodleService.getRemoveBySessions(
                idmoodle,
                moodleSession.sessionid,
              );
            }
          }
        }
        // Añadir sesiones de parsedSiad a sessionsMoodle
        for (const siadSession of parsedSiad) {
          const matchingSession = sessionsMoodle.find(
            (moodleSession) =>
              moodleSession.sessdate === siadSession.sessiontime,
          );
          if (!matchingSession) {
            const regSession = await moodleService.getAddBySessions(
              idmoodle,
              JSON.stringify(siadSession),
            );

            //sessionsMoodle.push(regSession);
            console.log(regSession);
          }
        }
        return { message: 'Transferido' };
      } else {
        return {
          message:
            'No se encontraron diferencias, todas las sesiones son coincidentes.',
        };
      }
    }
  } catch (error) {
    return {
      message: error,
    };
  }
};
