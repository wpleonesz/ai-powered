/**
 * Helper para procesar datos de usuarios en las APIs
 */
import { isEmpty } from 'lodash';
import { hash } from '@lib/hash';

/**
 * Formatea el nombre completo a partir del nombre y apellido
 * @param {string} firstName - Nombre
 * @param {string} lastName - Apellido
 * @returns {string} Nombre completo formateado
 */
export const parseName = (firstName, lastName) => {
  return `${firstName || ''} ${lastName || ''}`.trim().toUpperCase();
};

/**
 * Valida y formatea una dirección de email
 * @param {string} email - Email a formatear
 * @returns {string} Email formateado
 */
export const parseEmail = (email) => {
  return email?.toLowerCase();
};

/**
 * Procesa los roles de un usuario para el formato requerido por Prisma
 * @param {Array} roles - Array de IDs de roles
 * @returns {Object} Objeto con la estructura requerida por Prisma para Base_rolesOnUsersUncheckedCreateNestedManyWithoutUserInput
 */
export const parseRoles = (roles) => {
  if (!Array.isArray(roles) || roles.length === 0) return { create: [] };

  // Filtramos roles duplicados y roles no válidos (nulos, undefined, etc.)
  const uniqueRoles = [...new Set(roles.filter((r) => r))];

  return {
    create: uniqueRoles.map((roleId) => ({
      roleId: roleId,
      active: true,
    })),
  };
};

/**
 * Verifica un DNI
 * @param {string} dni - DNI a verificar
 * @returns {boolean} Resultado de la verificación
 */
export const checkDni = (dni) => {
  return Boolean(dni && dni.length > 5);
};

/**
 * Obtiene la configuración LDAP
 * @param {object} prisma - Cliente Prisma
 * @param {number} institutionId - ID de la institución
 * @returns {object} Configuración LDAP
 */
export const getLdap = async (prisma, institutionId) => {
  const ldapData = new LdapData(prisma);
  return await ldapData.where({ institutionId }).getFirst();
};

/**
 * Procesa grupos LDAP
 * @param {Array} groups - Grupos LDAP
 * @returns {Array} Grupos procesados
 */
export const parseLdapGroups = (groups) => {
  return Array.isArray(groups) ? groups : [];
};

/**
 * Prepara datos para crear usuario en LDAP
 * @param {object} data - Datos del usuario
 * @param {object} ldap - Configuración LDAP
 * @returns {object} Datos formateados para LDAP
 */
export const parseLdapCreateData = (data, ldap) => {
  return {
    username: data.username,
    password: data.password || hash.create(data.username),
    firstName: data.firstName,
    lastName: data.lastName,
    displayName: data.displayName || parseName(data.firstName, data.lastName),
    email: data.email,
    mobile: data.mobile,
    ou: data.ou,
    groups: data.groups || [],
    ldapId: ldap.id,
  };
};

/**
 * Crea un usuario en LDAP
 * @param {object} prisma - Cliente Prisma
 * @param {object} data - Datos del usuario
 * @returns {object} Resultado de la operación
 */
export const createOnLdap = async (prisma, data) => {
  if (isEmpty(data)) return null;

  const ldapOuData = new LdapOuData(prisma);
  const ou = await ldapOuData.where({ id: data.ou }).getFirst();

  const ldapGroupData = new LdapGroupData(prisma);
  const groups = await Promise.all(
    data.groups.map(async (groupId) => {
      return await ldapGroupData.where({ id: groupId }).getFirst();
    }),
  );

  const ldapUserVarData = new LdapUserVarData(prisma);
  return await ldapUserVarData.create({
    username: data.username,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    displayName: data.displayName,
    email: data.email,
    mobile: data.mobile,
    ou: ou?.name,
    ouId: ou?.id,
    groups: groups
      .filter(Boolean)
      .map((g) => g.name)
      .join(','),
    ldapId: data.ldapId,
  });
};
