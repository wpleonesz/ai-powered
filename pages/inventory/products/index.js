import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import ProductsTable from '@components/inventory/products/ProductsTable';
import ProductsList from '@components/inventory/products/ProductsList';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';

const Products = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="PRODUCTOS">
          <CreateButton
            url="/inventory/products/create"
            selector={selector.access.products}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<ProductsList />} web={<ProductsTable />} />
      </Container>
    </Grid>
  );
};

Products.propTypes = {};
Products.Layout = Dashboard;

export default Products;
