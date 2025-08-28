import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Select from '@ui/common/Select';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { mailAccountService } from '@services/mailAccount.service';
import { moduleService } from '@services/module.service';
import { mailServerService } from '@services/mailServer.service';
import { resolver } from '@validations/mailAccount.resolver';
import { useRouter } from 'next/router';
import { form } from '@lib/form';

const FIELDS = ['name', 'email', 'moduleId', 'mailServerId'];

const MailAccountForm = ({ record }) => {
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
      service: mailAccountService,
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
            id="email"
            label="Correo para el módulo"
            disabled={loading}
            errors={errors.email}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Select
            control={control}
            id="moduleId"
            label="Módulo"
            disabled={loading}
            errors={errors.moduleId}
            service={moduleService}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Select
            control={control}
            id="mailServerId"
            label="Servidor de correo"
            disabled={loading}
            errors={errors.mailServerId}
            service={mailServerService}
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

export default MailAccountForm;
