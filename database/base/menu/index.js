import ObjectData from '@lib/database';
import schemas from '@database/base/menu/schemas';

export const ESCAPE = ['Page', 'Module'];

class MenuData extends ObjectData {
  constructor() {
    const name = 'menu';
    const table = 'base_menu';
    super(name, table, schemas);
  }
}

export default MenuData;
