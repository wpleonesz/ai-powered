import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/institution/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/institution/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/institution', params);
};

const update = (id, params) => {
  return httpRequest.put(`/api/institution/${id}`, params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/institution/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/institution/${id}`, { active: true });
};

const getAllPublic = () => {
  return httpRequest.get('/api/public/institution');
};

export const institutionService = {
  getAll,
  public: { getAll: getAllPublic },
  getById,
  create,
  update,
  deactivate,
  activate,
};
