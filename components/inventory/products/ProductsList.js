import DataList from '@ui/common/DataList';
import Forbidden from '@ui/common/Forbidden';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { productService } from '@services/inventory/products.service';
import { sortHandler, filterHandler } from '@helper/filtering/base/campus';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([{ code: 'name', name: 'Nombre' }]);

const ProductsList = ({ where }) => {
  const access = useSelector(selector.access.products);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={productService}
      searchable={SEARCH}
      url="/inventory/products"
      title="name"
      description={(record) =>
        record.sku + ' - ' + record.description + ' - ' + record.price
      }
      access={access}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default ProductsList;
