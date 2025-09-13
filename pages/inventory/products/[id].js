import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import ProductForm from '@components/inventory/products/ProductsForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { useState, useEffect } from 'react';
import { productService } from '@services/inventory/products.service';
import { useSnackbar } from 'notistack';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const Product = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.products);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await productService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="PRODUCTO">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={productService}
        />
      </FormTitle>
      <ProductForm record={record} />
    </Grid>
  );
};

Product.propTypes = {};
Product.Layout = Dashboard;

export default Product;
