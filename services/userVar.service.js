import { httpRequest } from '@lib/httpRequest';

const update = (id, params) => {
  return httpRequest.put(`/api/user/var/${id}`, params);
};

const getAllById = (id) => {
  return httpRequest.get(`/api/user/var/${id}`);
};

export const userVarService = {
  update,
  getAllById,
};
