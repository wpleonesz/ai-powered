import nextConnect from 'next-connect';
import api from '@middleware/api';
import InstitutionData from '@database/base/institution';

// Este endpoint es público y no requiere autenticación

const handler = nextConnect();

handler.use(api).get((request) => {
  request.do('read', async (api) => {
    try {
      const institutionData = new InstitutionData();
      const institutions = await institutionData
        .where({ active: true })
        .orderBy({ name: 'asc' })
        .getAll();

      return api.successMany(institutions);
    } catch (error) {
      return api.error('Error al obtener las instituciones', 500);
    }
  });
});

export default handler;
