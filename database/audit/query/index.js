import ObjectData from '@lib/database';
import schemas from '@database/audit/query/schemas';

class QueryData extends ObjectData {
  constructor() {
    const name = 'query';
    const table = 'audit_query';
    super(name, table, schemas);
  }
}
export default QueryData;
