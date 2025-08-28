import DataList from '@ui/common/DataList';
import Forbidden from '@ui/common/Forbidden';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { campusService } from '@services/campus.service';
import { sortHandler, filterHandler } from '@helper/filtering/base/campus';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([
  { code: 'name', name: 'Nombre' },
  { code: 'institution', name: 'Institución' },
]);

const CampusList = ({ where }) => {
  const access = useSelector(selector.access.campus);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={campusService}
      searchable={SEARCH}
      url="/base/config/campus"
      title="name"
      description={(record) => record.Institution?.name}
      access={access}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default CampusList;
