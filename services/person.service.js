import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/person/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/person/${id}`);
};

const getByDni = (dni) => {
  return httpRequest.get(`/api/person/dni/${dni}`);
};

const create = (params) => {
  return httpRequest.post('/api/person', params);
};

const update = (id, params) => {
  return httpRequest.put(`/api/person/${id}`, params);
};

const updatePhoto = (id, photo) => {
  return httpRequest.put(`/api/person/photo/${id}`, { photo });
};

const remove = (id) => {
  return httpRequest.delete(`/api/person/${id}`);
};

export const personService = {
  getAll,
  getById,
  getByDni,
  create,
  update,
  updatePhoto,
  remove,
};
