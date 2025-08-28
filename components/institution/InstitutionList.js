import DataList from '@ui/common/DataList';
import Forbidden from '@ui/common/Forbidden';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { institutionService } from '@services/institution.service';
import { sortHandler, filterHandler } from '@helper/filtering/base/institution';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([{ code: 'name', name: 'Nombre' }]);

const description = (row) => {
  return (
    <>
      <div>
        <b>Código IES (SENESCYT):</b> {row.code_ies}
      </div>
    </>
  );
};

const InstitutionList = ({ where }) => {
  const access = useSelector(selector.access.institution);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={institutionService}
      searchable={SEARCH}
      url="/base/config/institutions"
      title="name"
      description={description}
      access={access}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default InstitutionList;
