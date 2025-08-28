import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import ImageField from '@ui/common/ImageField';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { resolver } from '@validations/institution.resolver';
import { institutionService } from '@services/institution.service';
import { useRouter } from 'next/router';
import { form } from '@lib/form';

const FIELDS = ['name', 'logo', 'isologo', 'code_ies'];

const InstitutionForm = ({ record }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    control,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({ resolver, defaultValues: form.defaultValues(record, FIELDS) });

  const onSubmit = async (data) => {
    if (loading) return;
    form.submit({
      recordId: record.id,
      data,
      service: institutionService,
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
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
            id="code_ies"
            label="Código IES (SENESCYT)"
            disabled={loading}
            errors={errors.code_ies}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <ImageField
            control={control}
            id="logo"
            label="Logo"
            type="image/*"
            disabled={loading}
            errors={errors.logo}
            errorHandler={{ set: setError, clear: clearErrors }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <ImageField
            control={control}
            id="isologo"
            label="Isologo"
            type="image/*"
            disabled={loading}
            errors={errors.isologo}
            errorHandler={{ set: setError, clear: clearErrors }}
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

export default InstitutionForm;
