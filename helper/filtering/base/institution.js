import { filterField } from '@lib/datagrid';

export const sortHandler = (field, sort) => {
  if (field === 'ldap') return { Ldap: { name: sort } };
};

export const filterHandler = (field, value, operator) => {
  if (field === 'ldap') return { Ldap: filterField('name', operator, value) };
};
