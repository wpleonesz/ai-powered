import DataGridServer from '@ui/common/DataGridServer';
import ActionCell from '@ui/common/ActionCell';
import Forbidden from '@ui/common/Forbidden';
import { productService } from '@services/inventory/products.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { sortHandler, filterHandler } from '@helper/filtering/base/campus';
import { Paper } from '@material-ui/core';

const parseHandler = (rows) => {
  return rows.map((row) => ({ ...row }));
};

const ProductsTable = ({ where }) => {
  const access = useSelector(selector.access.products);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    {
      field: 'description',
      headerName: 'Descripción',
      valueFormatter: (params) => params.value || '-',
      flex: 1,
    },
    {
      field: 'sku',
      headerName: 'SKU',
      flex: 1,
    },
    {
      field: 'price',
      headerName: 'Precio',
      flex: 1,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      flex: 1,
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
          url="/inventory/products"
          service={productService}
          access={access}
        />
      ),
    },
  ];
  return (
    <Paper style={{ height: 600, width: '100%', padding: 16 }} elevation={3}>
      <DataGridServer
        where={where}
        service={productService}
        columns={column}
        parseHandler={parseHandler}
        sortHandler={sortHandler}
        filterHandler={filterHandler}
      />
    </Paper>
  );
};

export default ProductsTable;
