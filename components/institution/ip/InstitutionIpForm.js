import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Select from '@ui/common/Select';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useForm, useWatch } from 'react-hook-form';
import { resolver } from '@validations/institutionIp.resolver';
import { institutionIpService } from '@services/institutionIp.service';
import { form } from '@lib/form';
import { institutionService } from '@services/institution.service';
import { campusService } from '@services/campus.service';

const FIELDS = [
  'name',
  'ip',
  'institutionId',
  'campusId',
  'latitude',
  'longitude',
];

const InstitutionIpForm = ({ record }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({ resolver, defaultValues: form.defaultValues(record, FIELDS) });

  const institutionId = useWatch({ control, name: 'institutionId' });

  const onSubmit = (data) => {
    if (loading) return;
    form.submit({
      recordId: record.id,
      data,
      service: institutionIpService,
      router,
      dirtyFields,
      enqueueSnackbar,
      reset,
      setLoading,
      fields: FIELDS,
    });
  };

  const onChangeInstitution = () => {
    setValue('campusId', null, { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            control={control}
            id="name"
            label="Nombre"
            disabled={loading}
            errors={errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            control={control}
            id="ip"
            label="IP pública"
            disabled={loading}
            errors={errors.ip}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Select
            control={control}
            id="institutionId"
            label="Institución"
            disabled={loading}
            errors={errors.institutionId}
            service={institutionService}
            onChange={onChangeInstitution}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Select
            control={control}
            id="campusId"
            label="Campus"
            disabled={loading}
            errors={errors.campusId}
            service={campusService}
            filterBy={(item) => item.institutionId === institutionId}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            control={control}
            id="latitude"
            label="Latitud"
            disabled={loading}
            errors={errors.latitude}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            control={control}
            id="longitude"
            label="Longitud"
            disabled={loading}
            errors={errors.longitude}
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

export default InstitutionIpForm;
