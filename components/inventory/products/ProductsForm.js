import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { resolver } from '@validations/inventory/products.resolver';
import { productService } from '@services/inventory/products.service';
import { useRouter } from 'next/router';
import { form } from '@lib/form';

const FIELDS = ['name', 'description', 'sku', 'price', 'stock'];

const ProductForm = ({ record }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({ resolver, defaultValues: form.defaultValues(record, FIELDS) });

  const onSubmit = async (data) => {
    if (loading) return;
    form.submit({
      recordId: record.id,
      data,
      service: productService,
      router,
      dirtyFields,
      enqueueSnackbar,
      reset,
      setLoading,
      fields: FIELDS,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            control={control}
            id="name"
            label="Nombre"
            disabled={loading}
            errors={errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <TextField
            control={control}
            id="sku"
            label="SKU"
            disabled={loading}
            errors={errors.sku}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <TextField
            control={control}
            id="price"
            label="Precio"
            disabled={loading}
            errors={errors.price}
            type={'number'}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <TextField
            control={control}
            id="stock"
            label="Stock"
            disabled={loading}
            errors={errors.stock}
            type={'number'}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            control={control}
            id="description"
            label="Descripción"
            disabled={loading}
            errors={errors.description}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Button
            type="submit"
            size="medium"
            fullWidth
            variant="contained"
            color="primary"
            align="center"
            onClick={handleSubmit(onSubmit)}
            disabled={loading || !isDirty}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
      {loading && <Loading />}
    </form>
  );
};

export default ProductForm;
