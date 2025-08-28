import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  spinner: {
    color: 'white',
  },
}));

const Spinner = ({ size, thickness, color }) => {
  const classes = useStyles();

  return (
    <CircularProgress
      size={size || 15}
      color={color || 'primary'}
      thickness={thickness || 10}
      className={classes.spinner}
    />
  );
};

export default Spinner;
