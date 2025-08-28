import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/institution/ip/', filters);
};

const getById = (id) => {
  return httpRequest.get(`/api/institution/ip/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/institution/ip', params);
};

const update = (id, params) => {
  return httpRequest.put(`/api/institution/ip/${id}`, params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/institution/ip/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/institution/ip/${id}`, { active: true });
};

export const institutionIpService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
  activate,
};
