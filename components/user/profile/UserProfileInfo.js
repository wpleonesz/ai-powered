import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { dates } from '@lib/dates';

const useStyles = makeStyles((theme) => ({
  alert: {
    marginBottom: theme.spacing(0.25),
    '& .MuiAlert-message': {
      fontWeight: 500,
      fontSize: '0.8rem',
      padding: theme.spacing(0, 0.5),
    },
    '& .MuiAlert-icon': {
      fontSize: '0.9rem',
      padding: theme.spacing(0.5),
    },
    '& .MuiAlert-root': {
      padding: theme.spacing(0.25, 1),
      minHeight: '32px',
    },
  },
  infoContainer: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    width: '100%',
    maxWidth: '900px',
  },
  sectionTitle: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(1.5),
    '& .MuiIcon-root': {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
    },
  },
  infoItem: {
    display: 'flex',
    padding: theme.spacing(0.5, 0),
    fontSize: '0.85rem',
    '& .label': {
      fontWeight: 500,
      minWidth: '140px',
    },
    '& .value': {
      color: theme.palette.text.secondary,
    },
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));

const UserProfileInfo = ({ user }) => {
  const classes = useStyles();
  const createdDate = user?.createdDate
    ? dates.toString(user?.createdDate)
    : '-';
  const lastPasswordDate = user?.lastPasswordDate
    ? dates.toString(user?.lastPasswordDate)
    : '-';
  const dueDays = user?.lastPasswordDate
    ? dates.dueDaysUntil(user?.lastPasswordDate, 180)
    : 0;

  const activeColor = () => (user?.active ? 'success' : 'error');
  const activeLabel = () => (user?.active ? 'activada' : 'desactivada');

  const passwordChangeSeverity = () => {
    if (dueDays <= 1) return 'error';
    if (dueDays <= 5) return 'warning';
    return 'info';
  };

  const showDueDays = () => {
    return !['66050', '66048'].includes(user?.AccountType?.value);
  };

  return (
    <Grid container spacing={0.5} className={classes.infoContainer}>
      {/* Alertas de estado */}
      {!!user?.lastPasswordDate && showDueDays() && (
        <Grid item xs={12} className={classes.alert}>
          <Alert severity={passwordChangeSeverity()} variant="outlined">
            Le quedan <strong>{dueDays}</strong>{' '}
            {dueDays === 1 ? 'día' : 'días'} para cambiar su contraseña
          </Alert>
        </Grid>
      )}
      {!showDueDays() && (
        <Grid item xs={12} className={classes.alert}>
          <Alert severity="info" variant="outlined">
            Su contraseña nunca expira
          </Alert>
        </Grid>
      )}
      <Grid item xs={12} className={classes.alert}>
        <Alert severity={activeColor()} variant="outlined">
          Su cuenta se encuentra <strong>{activeLabel()}</strong>
        </Alert>
      </Grid>

      {/* Información personal */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" className={classes.sectionTitle}>
          <Icon>person</Icon> Información Personal
        </Typography>
        <Divider className={classes.divider} />

        <div className={classes.infoItem}>
          <span className="label">Nombre completo:</span>
          <span className="value">{user?.Person?.name || '-'}</span>
        </div>
        <div className={classes.infoItem}>
          <span className="label">Cédula/Pasaporte:</span>
          <span className="value">{user?.Person?.dni || '-'}</span>
        </div>
        {user?.Person?.mobile && (
          <div className={classes.infoItem}>
            <span className="label">Teléfono:</span>
            <span className="value">{user?.Person?.mobile}</span>
          </div>
        )}
        {user?.Person?.address && (
          <div className={classes.infoItem}>
            <span className="label">Dirección:</span>
            <span className="value">{user?.Person?.address}</span>
          </div>
        )}
      </Grid>

      {/* Información institucional */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" className={classes.sectionTitle}>
          <Icon>business</Icon> Información Institucional
        </Typography>
        <Divider className={classes.divider} />

        <div className={classes.infoItem}>
          <span className="label">Institución:</span>
          <span className="value">{user?.Institution?.name || '-'}</span>
        </div>
        {user?.Campus && (
          <div className={classes.infoItem}>
            <span className="label">Campus:</span>
            <span className="value">{user?.Campus?.name || '-'}</span>
          </div>
        )}
        {user?.AccountType && (
          <div className={classes.infoItem}>
            <span className="label">Tipo de cuenta:</span>
            <span className="value">{user?.AccountType?.name || '-'}</span>
          </div>
        )}
      </Grid>

      {/* Información de cuenta */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" className={classes.sectionTitle}>
          <Icon>settings</Icon> Información de Cuenta
        </Typography>
        <Divider className={classes.divider} />

        <div className={classes.infoItem}>
          <span className="label">Usuario:</span>
          <span className="value">{user?.username || '-'}</span>
        </div>
        <div className={classes.infoItem}>
          <span className="label">Correo:</span>
          <span className="value">{user?.email || '-'}</span>
        </div>
        <div className={classes.infoItem}>
          <span className="label">Creado en:</span>
          <span className="value">{createdDate}</span>
        </div>
        <div className={classes.infoItem}>
          <span className="label">Última actualización:</span>
          <span className="value">{lastPasswordDate}</span>
        </div>
      </Grid>

      {/* Roles del usuario */}
      {user?.roles && user?.roles.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="subtitle1" className={classes.sectionTitle}>
            <Icon>security</Icon> Roles y Permisos
          </Typography>
          <Divider className={classes.divider} />

          <div className={classes.infoItem}>
            <span className="label">Roles asignados:</span>
            <span className="value">
              {user?.roles.map((role) => role.Role?.name || '-').join(', ')}
            </span>
          </div>
        </Grid>
      )}
    </Grid>
  );
};

export default UserProfileInfo;
