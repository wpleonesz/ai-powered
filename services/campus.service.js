import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/campus/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/campus/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/campus', params);
};

const update = (id, params) => {
  return httpRequest.put(`/api/campus/${id}`, params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/campus/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/campus/${id}`, { active: true });
};

export const campusService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
  activate,
};
