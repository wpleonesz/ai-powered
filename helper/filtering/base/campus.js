import { filterField } from '@lib/datagrid';

export const sortHandler = (field, sort) => {
  if (field === 'institution') return { Institution: { name: sort } };
};

export const filterHandler = (field, value, operator) => {
  if (field === 'institution')
    return { Institution: filterField('name', operator, value) };
};
