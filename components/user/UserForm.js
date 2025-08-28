import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Select from '@ui/common/Select';
import Title from '@ui/common/Title';
import Paper from '@ui/common/Paper';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import { useState, useEffect, useCallback } from 'react';
import { deburr } from 'lodash';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { useForm, useWatch, useFormState } from 'react-hook-form';
import { resolver } from '@validations/user.resolver';
import { userService } from '@services/user.service';
import { useRouter } from 'next/router';
import { form } from '@lib/form';
import { page } from '@lib/page';
import { roleService } from '@services/role.service';
import { validateDni } from '@helper/dni';
import { trim } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@ui/common/Switch';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  sectionTitle: {
    fontWeight: 500,
    color: '#1c1e21',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  submitButton: {
    marginTop: theme.spacing(3),
    padding: '10px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'none',
    borderRadius: '6px',
  },
}));

const defaultValues = (record) => {
  return {
    dni: record.Person?.dni || '',
    firstName: record.Person?.firstName || '',
    lastName: record.Person?.lastName || '',
    name: record.Person?.name || '',
    username: record.username?.split('@')[0] || '',
    email: record.username || '',
    personalEmail: record.Person?.email || '',
    mobile: record.Person?.mobile || '',
    campusId: record.campusId,
    roles:
      record.roles?.filter((item) => item.active).map((item) => item.roleId) ||
      [],
    schedules:
      record.schedules
        ?.filter((item) => item.active)
        .map((item) => item.scheduleId) || [],
    password: '',
    confirmPassword: '',
  };
};

const UserForm = ({ record }) => {
  const classes = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [institution, setInstitution] = useState({});
  const [person, setPerson] = useState(record.Person || {});
  const [personFound, setPersonFound] = useState(!!record.id);
  const [isDni, setIsDni] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, reset, control, setValue } = useForm({
    resolver,
    defaultValues: defaultValues(record),
  });
  const { errors, isDirty, dirtyFields } = useFormState({
    control,
  });
  console.log(errors);
  const firstName = useWatch({ control, name: 'firstName', defaultValue: '' });
  const lastName = useWatch({ control, name: 'lastName', defaultValue: '' });
  const username = useWatch({ control, name: 'username', defaultValue: '' });
  const dni = useWatch({ control, name: 'dni', defaultValue: '' });

  const setEmail = useCallback(
    (_username) => {
      const email = `${_username || username}@ejemplo.edu.ec`;
      setValue('email', email, { shouldDirty: true });
    },
    [setValue, username],
  );

  const setUsername = useCallback(() => {
    const _firstName = firstName || person?.firstName || '';
    const _lastName = lastName || person?.lastName || '';
    if (!(_firstName && _lastName)) return;
    let [name, secondName] = _firstName?.split(' ') || [];
    let [surname, secondSurName] = _lastName?.split(' ') || [];
    const first = name?.slice(0, 1) || '';
    const second = secondName?.slice(0, 1) || '';
    const third = secondSurName?.slice(0, 1) || '';
    let username = `${first}${second}.${surname}${third}`;
    username = deburr(username).toLowerCase();
    setValue('username', username, { shouldDirty: true });
    setEmail(username);
  }, [firstName, lastName, person, setEmail, setValue]);

  const setName = useCallback(() => {
    const first = firstName?.toUpperCase() || person?.firstName || '';
    const last = lastName?.toUpperCase() || person?.lastName || '';
    if (!(first && last)) return;
    const name = trim(`${first} ${last}`);
    setValue('name', name);
  }, [firstName, lastName, person, setValue]);

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => {
        setValue('checkDni', true, { shouldDirty: true });
        setLoading(true);
        try {
          const institutionData = await userService.getInstitution();
          setInstitution(institutionData || {});
        } catch (error) {
          console.error('Error al obtener datos de la institución:', error);
          snackbar.warning(
            enqueueSnackbar,
            'No se pudo cargar la información de la institución. Algunas funciones pueden estar limitadas.',
          );
        }
      },
      () => setLoading(false),
    );
  }, [enqueueSnackbar, setValue]);

  useEffect(() => {
    setName();
    setUsername();
  }, [person, setName, setUsername]);

  const findPerson = (event) => {
    if (loading) return;
    const dni = event?.target?.value;
    if (!dni) return;
    page.loader(
      enqueueSnackbar,
      async () => {
        if (isDni && !validateDni(dni)) throw 'Cédula no válida';
        setLoading(true);
        setPersonFound(false);
        const person = await userService.getUniquePersonByDni(dni);
        setPersonFound(true);
        if (person.id) {
          setValue('firstName', person.firstName || '', { shouldDirty: true });
          setValue('lastName', person.lastName || '', { shouldDirty: true });
          setValue('name', person.name || '', { shouldDirty: true });
          setPerson(person);
        }
      },
      () => setLoading(false),
      () => setValue('dni', '', { shouldDirty: true }),
    );
  };

  const onBlurUsername = () => {
    setEmail();
  };

  const onChangeName = () => {
    setName();
    setUsername();
  };

  const onChangeCheckDni = (event) => {
    setIsDni(event.target.checked);
    if (!event.target.checked) return;
    if (!dni) return;
    if (!validateDni(dni)) {
      setValue('dni', '', { shouldDirty: true });
      snackbar.error(enqueueSnackbar, 'Cédula no válida');
    }
  };

  const onSubmit = async (data) => {
    if (loading) return;
    form.submit({
      recordId: record.id,
      data,
      service: userService,
      router,
      dirtyFields,
      enqueueSnackbar,
      reset,
      setLoading,
      defaultHandler: defaultValues,
    });
  };

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Paper>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Title title="Información Personal" />
              {!record.id && (
                <div style={{ textAlign: 'right', marginTop: '-40px' }}>
                  <Switch
                    id="checkDni"
                    control={control}
                    label="Validar cédula"
                    checked={isDni}
                    justifyContent="flex-end"
                    onChange={onChangeCheckDni}
                  />
                </div>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                control={control}
                id="dni"
                label="Cédula/Pasaporte"
                fullWidth
                disabled={loading || !!record.id}
                errors={errors.dni}
                onBlur={findPerson}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                control={control}
                id="firstName"
                label="Nombres"
                fullWidth
                disabled={loading || !!person.id || !personFound}
                errors={errors.firstName}
                onBlur={onChangeName}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                control={control}
                id="lastName"
                label="Apellidos"
                fullWidth
                disabled={loading || !!person.id || !personFound}
                errors={errors.lastName}
                onBlur={onChangeName}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                control={control}
                id="name"
                label="Nombre completo"
                fullWidth
                disabled={true}
                errors={errors.name}
                shrink={true}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                control={control}
                id="personalEmail"
                label="Correo personal"
                fullWidth
                disabled={loading || !personFound}
                errors={errors.personalEmail}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                control={control}
                id="mobile"
                label="Teléfono Móvil"
                fullWidth
                disabled={loading || !personFound}
                errors={errors.mobile}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Title title="Información de Cuenta" />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                control={control}
                id="username"
                label="Nombre de Usuario"
                fullWidth
                disabled={loading || !!person.id || !personFound}
                errors={errors.username}
                onBlur={onBlurUsername}
                shrink={true}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                control={control}
                id="email"
                label="Correo institucional"
                fullWidth
                disabled={true}
                errors={errors.email}
                shrink={true}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Select
                control={control}
                id="campusId"
                label="Campus"
                fullWidth
                records={institution?.campus || []}
                disabled={loading || !personFound}
                errors={errors.campusId}
                dataHandler={async () => {
                  if (institution?.campus?.length > 0) {
                    return institution.campus;
                  }
                  // Fallback para cuando no se puede cargar la institución
                  return [
                    { id: 1, name: 'Campus Principal' },
                    { id: 2, name: 'Campus Secundario' },
                  ];
                }}
              />
            </Grid>

            {!record.id && (
              <>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    control={control}
                    id="password"
                    label="Contraseña"
                    type="password"
                    fullWidth
                    disabled={loading || !personFound}
                    errors={errors.password}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    control={control}
                    id="confirmPassword"
                    label="Confirmar Contraseña"
                    type="password"
                    fullWidth
                    disabled={loading || !personFound}
                    errors={errors.confirmPassword}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Title title="Roles del Sistema" />
            </Grid>

            <Grid item xs={12}>
              <Select
                control={control}
                id="roles"
                label="Roles"
                fullWidth
                disabled={loading || !personFound}
                errors={errors.roles}
                service={roleService}
                multiple={true}
              />
            </Grid>
          </Grid>
        </Paper>

        <Grid
          container
          spacing={1}
          justifyContent="flex-end"
          style={{ marginTop: '20px' }}
        >
          <Grid item xs={12} sm={4} md={3}>
            <Button
              type="submit"
              size="medium"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submitButton}
              onClick={handleSubmit(onSubmit)}
              disabled={loading || !isDirty}
            >
              {record.id ? 'Actualizar' : 'Registrar Usuario'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default UserForm;
