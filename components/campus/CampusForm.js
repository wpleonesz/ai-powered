import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Select from '@ui/common/Select';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { resolver } from '@validations/campus.resolver';
import { campusService } from '@services/campus.service';
import { institutionService } from '@services/institution.service';
import { useRouter } from 'next/router';
import { form } from '@lib/form';

const FIELDS = ['name', 'institutionId', 'code_ext_mrt'];

const CampusForm = ({ record }) => {
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
      service: campusService,
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
          <Select
            control={control}
            id="institutionId"
            label="Institución"
            disabled={loading}
            errors={errors.institutionId}
            service={institutionService}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <TextField
            control={control}
            id="code_ext_mrt"
            label="Código Matriz/Extensión"
            disabled={loading}
            errors={errors.code_ext_mrt}
            type="number"
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

export default CampusForm;
