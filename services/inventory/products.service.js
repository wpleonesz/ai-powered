import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/inventory/products/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/inventory/products/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/inventory/products', params);
};

const update = (id, params) => {
  return httpRequest.put(`/api/inventory/products/${id}`, params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/inventory/products/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/inventory/products/${id}`, { active: true });
};

export const productService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
  activate,
};
