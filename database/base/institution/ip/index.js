import ObjectData from '@lib/database';
import schemas from '@database/base/institution/ip/schemas';

export const ESCAPE = ['Institution', 'Campus'];

class InstitutionIpData extends ObjectData {
  constructor() {
    const name = 'institutionIp';
    const table = 'base_institutionIp';
    super(name, table, schemas);
  }
}

export default InstitutionIpData;
