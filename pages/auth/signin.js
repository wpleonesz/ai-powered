import Layout from '@ui/layout/auth/Layout';
import Select from '@ui/common/Select';
import TextField from '@ui/common/TextField';
import Loading from '@ui/common/Loading';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { institutionService } from '@services/institution.service';
import { resolver } from '@validations/auth/singnin.resolver';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { authService } from '@services/auth.service';
import { toInteger } from 'lodash';

const useStyles = makeStyles((theme) => ({
  fieldContainer: {
    width: '100%',
    marginBottom: '14px',
  },
  buttonContainer: {
    width: '100%',
    paddingTop: theme.spacing(1),
  },
  tabs: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    '& .MuiTab-root': {
      minHeight: '48px',
      fontSize: '1rem',
      textTransform: 'none',
      fontWeight: 500,
      flex: 1,
    },
    '& .MuiTabs-indicator': {
      height: '3px',
    },
  },
  tabPanel: {
    width: '100%',
    padding: 0,
  },
  compactInput: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      '& input': {
        padding: '14px 16px',
        fontSize: '17px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1877f2',
      },
    },
  },
  loginButton: {
    width: '100%',
    padding: '10px 0',
    fontSize: '20px',
    fontWeight: 'bold',
    textTransform: 'none',
    borderRadius: '6px',
    backgroundColor: '#1877f2',
    '&:hover': {
      backgroundColor: '#166fe5',
    },
  },
  createAccountBtn: {
    marginTop: theme.spacing(2),
    padding: '10px 16px',
    backgroundColor: '#42b72a',
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '17px',
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: '#36a420',
    },
  },
  divider: {
    width: '100%',
    margin: theme.spacing(2, 0),
    color: '#96999e',
  },
}));

export const getServerSideProps = async () => {
  try {
    // Establecer un tiempo límite para la solicitud
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Tiempo de espera agotado')), 5000),
    );

    const dataPromise = institutionService.public.getAll();

    // Usar Promise.race para limitar el tiempo de la solicitud
    const institutions = await Promise.race([
      dataPromise,
      timeoutPromise,
    ]).catch(() => {
      console.error(
        'Error al cargar instituciones, usando valores por defecto',
      );
      return [];
    });

    return { props: { institutions: institutions || [] } };
  } catch (error) {
    console.error('Error en getServerSideProps:', error);
    // Devolver un array vacío si hay errores
    return { props: { institutions: [] } };
  }
};

const Signin = ({ institutions }) => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [company, setCompany] = useState(institutions[0]?.name || '');
  // Asegurarnos de que el logo tenga la ruta correcta
  const [logo, setLogo] = useState(() => {
    const logoPath = institutions[0]?.logo || '';
    if (!logoPath) return '';
    return logoPath.startsWith('/') || logoPath.startsWith('http')
      ? logoPath
      : `/${logoPath}`;
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver,
    defaultValues: { institutionId: institutions[0]?.id, institutions },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const user = await authService.public.user();
        if (user) await router.replace('/');
      } catch (error) {
      } finally {
        setChecking(false);
      }
    };
    load();
  }, [router]);

  const onSubmit = async (data) => {
    if (!loading) {
      setLoading(true);
      try {
        await authService.signin({
          ...data,
          institutionId: toInteger(data.institutionId),
        });
        router.replace('/');
      } catch (error) {
        snackbar.error(enqueueSnackbar, error);
        manageDuePassword(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const manageDuePassword = (error) => {
    if (!(typeof error === 'string')) return;
    if (error.includes('Su contraseña ha caducado'))
      router.replace('/auth/recover');
  };

  const onChangeCompany = (company) => {
    setCompany(company.name);
    // Asegurarnos de que el logo tenga la ruta correcta
    const logoPath = company.logo || '';
    if (!logoPath) {
      setLogo('');
    } else {
      setLogo(
        logoPath.startsWith('/') || logoPath.startsWith('http')
          ? logoPath
          : `/${logoPath}`,
      );
    }
  };

  if (checking) return <></>;

  return (
    <Layout signin={false} logo={logo} institution={company}>
      <Box width="100%">
        <Typography
          variant="h5"
          component="h1"
          align="center"
          gutterBottom
          style={{ marginBottom: '20px' }}
        >
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid item className={classes.fieldContainer}>
            <TextField
              control={control}
              id="username"
              label="Usuario"
              disabled={loading}
              errors={errors.username}
              size="small"
              className={classes.compactInput}
            />
          </Grid>

          <Grid item className={classes.fieldContainer}>
            <TextField
              control={control}
              id="password"
              type="password"
              label="Contraseña"
              disabled={loading}
              errors={errors.password}
              size="small"
              className={classes.compactInput}
            />
          </Grid>

          <Grid item className={classes.fieldContainer}>
            <Select
              control={control}
              id="institutionId"
              label="Institución"
              disabled={loading}
              errors={errors.institutionId}
              reload={false}
              records={institutions}
              onChange={onChangeCompany}
              size="small"
              className={classes.compactInput}
            />
          </Grid>

          <Grid
            item
            className={[classes.fieldContainer, classes.buttonContainer]}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.loginButton}
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
            >
              Iniciar Sesión
            </Button>
          </Grid>
        </form>

        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            fullWidth
            className={classes.createAccountBtn}
            href="/auth/register"
          >
            Crear cuenta nueva
          </Button>
        </Box>
      </Box>

      {loading && <Loading />}
    </Layout>
  );
};

export default Signin;
