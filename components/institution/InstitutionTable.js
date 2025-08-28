import DataGridServer from '@ui/common/DataGridServer';
import ActionCell from '@ui/common/ActionCell';
import Forbidden from '@ui/common/Forbidden';
import { institutionService } from '@services/institution.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { sortHandler, filterHandler } from '@helper/filtering/base/institution';

const parseHandler = (rows) => {
  return rows.map((row) => ({ ...row, ldap: row.Ldap?.name }));
};

const InstitutionTable = ({ where }) => {
  const access = useSelector(selector.access.institution);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'name', headerName: 'Nombre', flex: 1.5 },
    { field: 'ldap', headerName: 'Conexión LDAP', flex: 1.5 },
    { field: 'code_ies', headerName: 'Código IES (SENESCYT)', flex: 1 },
    {
      field: 'Acciones',
      width: 220,
      headerAlign: 'center',
      align: 'center',
      renderCell: (record) => (
        <ActionCell
          record={record}
          url="/base/config/institutions"
          service={institutionService}
          access={access}
        />
      ),
    },
  ];
  return (
    <DataGridServer
      where={where}
      service={institutionService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default InstitutionTable;
