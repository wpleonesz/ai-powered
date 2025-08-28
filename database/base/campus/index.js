import ObjectData from '@lib/database';
import schemas from '@database/base/campus/schemas';

export const ESCAPE = ['Institution'];

class CampusData extends ObjectData {
  constructor() {
    const name = 'campus';
    const table = 'base_campus';
    super(name, table, schemas);
  }
}

export default CampusData;
