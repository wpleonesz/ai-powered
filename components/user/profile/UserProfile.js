import Grid from '@material-ui/core/Grid';
import Stack from '@mui/material/Stack';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import UserProfileCard from '@components/user/profile/UserProfileCard';
import UserProfileInfo from '@components/user/profile/UserProfileInfo';
import ChangePasswordDialog from '@components/user/password/ChangePasswordDialog';
import RecoverPasswordDialog from '../password/RecoverPasswordDialog';
import UserProfileLogo from '@components/user/profile/UserProfileLogo';
import Paper from '@ui/common/Paper';
import Icon from '@material-ui/core/Icon';
import { useState } from 'react';
import { userService } from '@services/user.service';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { authService } from '@services/auth.service';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(2, 1),
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    marginBottom: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5, 0.5),
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      width: '100%',
    },
  },
  photo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '150px',
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      paddingRight: 0,
      width: '100%',
      maxWidth: '150px',
      overflow: 'hidden',
      alignSelf: 'center',
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 0,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      width: '100%',
      paddingLeft: 0,
      marginLeft: 0,
      marginTop: theme.spacing(0),
    },
  },
  credentialsCard: {
    borderRadius: theme.spacing(0.5),
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    border: `1px solid ${theme.palette.grey[100]}`,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 3px 6px rgba(0, 0, 0, 0.08)',
    },
    [theme.breakpoints.down('xs')]: {
      width: '95%',
      maxWidth: '350px',
      margin: '0 auto',
    },
  },
  credentialTitle: {
    padding: theme.spacing(0.5, 0),
    fontWeight: 500,
    color: theme.palette.primary.main,
    fontSize: '0.85rem',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    marginBottom: theme.spacing(0.5),
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.8, 0),
      fontSize: '0.9rem',
      marginBottom: theme.spacing(0.8),
    },
  },
  actionPanel: {
    width: '100%',
    padding: theme.spacing(0.5),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1, 0.5),
    },
  },
  button: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
    fontWeight: 400,
    fontSize: '0.7rem',
    padding: theme.spacing(0.3),
    minHeight: '24px',
    transition: 'all 0.2s ease',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5),
      fontSize: '0.75rem',
      minHeight: '32px',
    },
    '&:hover': {
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
      transform: 'translateY(-1px)',
    },
    '& .MuiButton-startIcon': {
      marginRight: theme.spacing(0.3),
    },
    '& .MuiSvgIcon-root': {
      fontSize: '0.7rem',
    },
    '& .MuiButton-label': {
      fontSize: '0.7rem',
      [theme.breakpoints.down('xs')]: {
        fontSize: '0.75rem',
      },
    },
  },
  profileContainer: {
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    marginBottom: '16px',
  },
  photoContainer: {
    textAlign: 'center',
    borderBottom: '1px dashed #e0e0e0',
    paddingBottom: '15px',
    marginBottom: '15px',
  },
  credentialsContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    padding: '16px',
  },
}));

const UserProfile = (props) => {
  const classes = useStyles();
  const profile = props.profile;
  const [openChange, setOpenChange] = useState(false);
  const [openRecover, setOpenRecover] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenChange = () => setOpenChange(true);
  const handleCloseChange = () => setOpenChange(false);
  const handleOpenRecover = () => setOpenRecover(true);
  const handleCloseRecover = () => setOpenRecover(false);

  const recoverPassword = async () => {
    if (!loading) {
      setLoading(true);
      try {
        // TODO: Get user email from local storage
        const user = await authService.user();
        const response = await userService.recoverPasswordByEmail(user.email);
        handleOpenRecover();
        snackbar.success(
          enqueueSnackbar,
          `Enlace de recuperación generado y enviado a: ${response.message}`,
        );
      } catch (error) {
        snackbar.error(enqueueSnackbar, error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Un único contenedor para todas las secciones */}
      <Grid container justifyContent="center" style={{ width: '100%' }}>
        <Grid
          item
          xs={12}
          style={{
            maxWidth: '900px',
            width: '100%',
          }}
        >
          <Paper
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              padding: '16px',
              overflow: 'hidden',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            {/* Sección 1: Foto de perfil */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px',
                paddingBottom: '10px',
                borderBottom: '1px dashed #e0e0e0',
              }}
            >
              <UserProfileLogo person={profile.Person} />
            </div>

            {/* Sección 2: Credenciales */}
            <div
              style={{
                width: '100%',
                marginBottom: '10px',
                paddingBottom: '10px',
                borderBottom: '1px dashed #e0e0e0',
              }}
            >
              <div style={{ width: '100%' }}>
                <Grid
                  container
                  justifyContent="center"
                  className={classes.credentialTitle}
                >
                  <strong
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      display: 'block',
                    }}
                  >
                    Credenciales
                  </strong>
                </Grid>
                <Stack
                  direction="column"
                  spacing={{ xs: 0.5, sm: 0.3 }}
                  style={{ width: '100%', padding: '4px' }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={handleOpenChange}
                    fullWidth
                    className={classes.button}
                    startIcon={<Icon>lock</Icon>}
                  >
                    Cambiar Clave
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={recoverPassword}
                    fullWidth
                    className={classes.button}
                    startIcon={<Icon>refresh</Icon>}
                  >
                    Recuperar
                  </Button>
                </Stack>
              </div>
            </div>

            {/* Sección 3: Información de perfil */}
            <div
              style={{
                width: '100%',
                marginBottom: '10px',
                paddingBottom: '10px',
                borderBottom: '1px dashed #e0e0e0',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <UserProfileCard user={profile} />
            </div>

            {/* Sección 4: Información adicional del usuario */}
            <div style={{ width: '100%' }}>
              <UserProfileInfo user={profile} />
            </div>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogos y loading */}
      <ChangePasswordDialog open={openChange} onClose={handleCloseChange} />
      <RecoverPasswordDialog open={openRecover} onClose={handleCloseRecover} />
      {loading && <Loading />}
    </>
  );
};

export default UserProfile;
