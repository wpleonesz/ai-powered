import ObjectData from '@lib/database';
import schemas from '@database/audit/document/schemas';

class DocumentData extends ObjectData {
  constructor() {
    const name = 'document';
    const table = 'audit_document';
    super(name, table, schemas);
  }
}
export default DocumentData;
