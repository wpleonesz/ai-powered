import nextConnect from 'next-connect';
import auth from '@middleware/auth';
import api from '@middleware/api';
import database from '@middleware/database';
import access from '@middleware/access';
import ProductData from '@database/inventory/products';
import helmet from 'helmet';

const handler = nextConnect();

handler
  .use(auth)
  .use(helmet())
  .use(api)
  .use(access('products'))
  .use(database(ProductData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      try {
        return api.successMany(
          await prisma.products.where({ active: true }).getAll(),
        );
      } catch (error) {
        return api.failure({ message: 'Error al obtener los productos' });
      }
    });
  })
  .post((request) => {
    request.do('create', async (api, prisma) => {
      try {
        return api.success(await prisma.products.create(request.body));
      } catch (error) {
        return api.failure({ message: 'Error al crear el producto' });
      }
    });
  });

export default handler;
