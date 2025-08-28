import DataGridServer from '@ui/common/DataGridServer';
import Forbidden from '@ui/common/Forbidden';
import ActionCell from '@ui/common/ActionCell';
import { institutionIpService } from '@services/institutionIp.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import {
  sortHandler,
  filterHandler,
} from '@helper/filtering/base/institution/ip';

const parseHandler = (rows) => {
  return rows.map((row) => ({ ...row, institution: row?.Institution?.name }));
};

const InstitutionIpTable = ({ where }) => {
  const access = useSelector(selector.access.institutionip);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'institution', headerName: 'Institución', flex: 1 },
    { field: 'ip', headerName: 'IP pública', flex: 1 },
    {
      field: 'Acciones',
      width: 220,
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <ActionCell
          record={record}
          url="/base/config/institutions/ip"
          service={institutionIpService}
          access={access}
        />
      ),
    },
  ];
  return (
    <DataGridServer
      where={where}
      service={institutionIpService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default InstitutionIpTable;
