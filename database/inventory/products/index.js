import ObjectData from '@lib/database';
import schemas from '@database/inventory/products/schemas';

class ProductData extends ObjectData {
  constructor() {
    const name = 'products';
    const table = 'products';
    super(name, table, schemas);
  }
}

export default ProductData;
