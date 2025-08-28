import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Button, Typography, Divider, Box } from '@material-ui/core';
import TextField from '@ui/common/TextField';
import Layout from '@ui/layout/auth/Layout';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import Loading from '@ui/common/Loading';
import { userService } from '@services/user.service';
import { useRouter } from 'next/router';
import { resolver } from '@validations/auth/register.resolver';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  formContainer: {
    padding: theme.spacing(3),
    width: '100%',
  },
  sectionTitle: {
    fontWeight: 500,
    color: '#1c1e21',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  fieldContainer: {
    width: '100%',
    marginBottom: '14px',
  },
  submitButton: {
    marginTop: theme.spacing(3),
    width: '100%',
    padding: '10px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    textTransform: 'none',
    borderRadius: '6px',
    backgroundColor: '#1877f2',
    color: 'white',
    '&:hover': {
      backgroundColor: '#166fe5',
    },
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  loginLink: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
    '& a': {
      color: '#1877f2',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}));

// Utilizamos el esquema de validación de register.resolver.js

const Register = () => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: resolver,
    defaultValues: {
      dni: '',
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Primero creamos la persona
      const personData = {
        dni: data.dni,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        mobile: data.mobile || '',
      };

      const personResponse = await userService.createPerson(personData);

      if (personResponse && personResponse.id) {
        // Ahora creamos el usuario
        const userData = {
          username: data.username,
          password: data.password,
          email: data.email,
          personId: personResponse.id,
          active: true,
        };

        await userService.create(userData);
        snackbar.success(enqueueSnackbar, 'Usuario registrado exitosamente');

        // Redirigir al login después de un registro exitoso
        setTimeout(() => {
          router.push('/auth/signin');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      snackbar.error(enqueueSnackbar, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      signin={true}
      forgot={false}
      subtitle="Crea tu cuenta"
      showLeftColumn={false}
    >
      <Grid container className={classes.root}>
        <Grid
          item
          container
          className={classes.formContainer}
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Registro de Usuario
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Divider className={classes.divider} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  control={control}
                  id="dni"
                  name="dni"
                  label="Cédula/Pasaporte"
                  fullWidth
                  disabled={loading}
                  errors={errors.dni}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  control={control}
                  id="firstName"
                  name="firstName"
                  label="Nombre"
                  fullWidth
                  disabled={loading}
                  errors={errors.firstName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  control={control}
                  id="lastName"
                  name="lastName"
                  label="Apellido"
                  fullWidth
                  disabled={loading}
                  errors={errors.lastName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  control={control}
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  disabled={loading}
                  errors={errors.email}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  control={control}
                  id="mobile"
                  name="mobile"
                  label="Teléfono Móvil"
                  fullWidth
                  disabled={loading}
                  errors={errors.mobile}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" className={classes.sectionTitle}>
              Información de Cuenta
            </Typography>
            <Divider className={classes.divider} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  control={control}
                  id="username"
                  name="username"
                  label="Nombre de Usuario"
                  fullWidth
                  disabled={loading}
                  errors={errors.username}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  control={control}
                  id="password"
                  name="password"
                  label="Contraseña"
                  type="password"
                  fullWidth
                  disabled={loading}
                  errors={errors.password}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  control={control}
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  type="password"
                  fullWidth
                  disabled={loading}
                  errors={errors.confirmPassword}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={loading}
            >
              Registrarse
            </Button>
          </form>

          <Box mt={3} width="100%" className={classes.loginLink}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography variant="body2" component="span">
                ¿Ya tienes una cuenta?
              </Typography>
              <Button
                href="/auth/signin"
                color="primary"
                style={{
                  padding: '0 5px',
                  minWidth: 'auto',
                  textTransform: 'none',
                }}
              >
                Iniciar sesión
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {loading && <Loading />}
    </Layout>
  );
};

export default Register;
