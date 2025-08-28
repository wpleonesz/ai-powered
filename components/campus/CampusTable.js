import DataGridServer from '@ui/common/DataGridServer';
import ActionCell from '@ui/common/ActionCell';
import Forbidden from '@ui/common/Forbidden';
import { campusService } from '@services/campus.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { sortHandler, filterHandler } from '@helper/filtering/base/campus';

const parseHandler = (rows) => {
  return rows.map((row) => ({ ...row, institution: row.Institution?.name }));
};

const CampusTable = ({ where }) => {
  const access = useSelector(selector.access.campus);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'name', headerName: 'Nombre', flex: 1.5 },
    {
      field: 'institution',
      headerName: 'Institución',
      flex: 1.5,
    },
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
          url="/base/config/campus"
          service={campusService}
          access={access}
        />
      ),
    },
  ];
  return (
    <DataGridServer
      where={where}
      service={campusService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default CampusTable;
