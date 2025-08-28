import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    padding: theme.spacing(3, 2),
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
}));

const AccessDenied = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h2>403 - Página no autorizada</h2>
    </div>
  );
};

export default AccessDenied;
