import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@ui/common/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(0),
    marginTop: theme.spacing(0.2),
    marginBottom: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    width: '100%',
    maxWidth: '900px',
    boxSizing: 'border-box',
    position: 'relative',
    margin: '0 auto',
    '&:hover': {
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    },
  },
  nameText: {
    fontWeight: 600,
    fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(0.3),
    whiteSpace: 'normal',
    overflow: 'visible',
    width: '100%',
    display: 'block',
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  emailText: {
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.7),
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    marginTop: theme.spacing(0.3),
  },
  icon: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(0.3),
  },
}));

const UserProfileCard = ({ user }) => {
  const classes = useStyles();
  return (
    <Grid container justifyContent="center" style={{ width: '100%' }}>
      <Paper className={classes.card}>
        <Grid
          container
          direction="column"
          spacing={0}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '8px 12px',
            overflow: 'hidden',
          }}
        >
          <Grid
            item
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 0',
            }}
          >
            <div style={{ width: '100%', maxWidth: '100%' }}>
              <Typography
                variant="h5"
                component="div"
                className={classes.nameText}
                title={user?.Person?.name || 'ADMINISTRADOR DEL SISTEMA'}
                style={{
                  fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
                  wordBreak: 'break-word',
                }}
              >
                {user?.Person?.name || 'ADMINISTRADOR DEL SISTEMA'}
              </Typography>
            </div>
            <div style={{ width: '100%' }}>
              <Typography
                variant="body1"
                className={classes.emailText}
                title={user?.email || '-'}
              >
                <Icon className={classes.icon}>email</Icon>
                {user?.email || '-'}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default UserProfileCard;
