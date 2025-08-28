import DataList from '@ui/common/DataList';
import Forbidden from '@ui/common/Forbidden';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { institutionIpService } from '@services/institutionIp.service';
import { filterList } from '@lib/datagrid';
import { sortHandler, filterHandler } from '@helper/filtering/base/menu';

const SEARCH = filterList([{ code: 'institution', name: 'Institution' }]);

const InstitutionIpList = ({ where }) => {
  const access = useSelector(selector.access.institutionip);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={institutionIpService}
      searchable={SEARCH}
      url="/base/config/institutions/ip"
      title="name"
      description="ip"
      access={access}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default InstitutionIpList;
