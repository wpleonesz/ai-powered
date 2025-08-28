import ObjectData from '@lib/database';
import schemas from '@database/base/institution/schemas';

export const ESCAPE = ['Ldap'];

class InstitutionData extends ObjectData {
  constructor() {
    const name = 'institution';
    const table = 'base_institution';
    super(name, table, schemas);
  }
}

export default InstitutionData;
