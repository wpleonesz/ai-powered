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
        return api.successOne(
          await prisma.products.record(request.query.id).getUnique(),
        );
      } catch (error) {
        return api.failure({ message: 'Error al obtener el producto' });
      }
    });
  })
  .delete((request) => {
    request.do('remove', async (api, prisma) => {
      try {
        return api.success(
          await prisma.products
            .record(request.query.id)
            .update({ active: false }),
        );
      } catch (error) {
        return api.failure({ message: 'Error al eliminar el producto' });
      }
    });
  })
  .put((request) => {
    request.do('write', async (api, prisma) => {
      try {
        return api.success(
          await prisma.products.record(request.query.id).update(request.body),
        );
      } catch (error) {
        return api.failure({ message: 'Error al actualizar el producto' });
      }
    });
  });

export default handler;
