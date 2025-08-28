import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  wrap: {
    overflow: 'hidden',
    position: 'relative',
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  main: {
    backgroundColor: '#f0f2f5',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minHeight: 'calc(100vh - 20px)',
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '980px',
    margin: '0 auto',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      width: '100%',
      padding: theme.spacing(0, 4),
    },
    [theme.breakpoints.up('md')]: {
      width: '80%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '980px',
    },
  },
  copyrightContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: '20px 0',
    color: '#737373',
    fontSize: '12px',
    borderTop: '1px solid #dddfe2',
  },
  logoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
    color: '#1c1e21',
    paddingRight: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
      textAlign: 'center',
      width: '100%',
      marginBottom: theme.spacing(4),
      paddingRight: 0,
    },
    [theme.breakpoints.up('md')]: {
      width: '400px',
      paddingTop: theme.spacing(10),
    },
  },
  formContainer: {
    flexWrap: 'nowrap',
    backgroundColor: '#FFF',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(3, 0),
    [theme.breakpoints.down('md')]: {
      width: '100%',
      maxWidth: '400px',
    },
    [theme.breakpoints.up('md')]: {
      width: '396px',
    },
  },
  formContainerFullWidth: {
    [theme.breakpoints.up('md')]: {
      width: '500px',
      maxWidth: '600px',
      margin: '0 auto',
    },
  },
  titleContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: theme.spacing(2),
    '& h5': {
      fontSize: '28px',
      lineHeight: '32px',
      fontWeight: 500,
      color: '#1c1e21',
      marginBottom: theme.spacing(2),
    },
    '& .subtitle': {
      fontSize: '24px',
      lineHeight: '28px',
      fontWeight: 400,
    },
  },
  childrenContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(0, 3),
  },
  fieldContainer: {
    width: '100%',
    marginBottom: '14px',
  },
  buttonContainer: {
    paddingTop: 10,
    width: '100%',
    '& .MuiButton-root': {
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '20px',
      textTransform: 'none',
      padding: '10px 0',
    },
  },
  linksContainer: {
    paddingTop: 16,
    borderTop: '1px solid #dadde1',
    marginTop: 20,
    width: '100%',
  },
  compactField: {
    marginBottom: '12px',
    width: '100%',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: '6px',
      },
      '& input': {
        padding: '14px 16px',
        fontSize: '17px',
      },
    },
    '& .MuiInputLabel-outlined': {
      transform: 'translate(16px, 16px) scale(1)',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1877f2',
    },
  },
  demo: {
    backgroundColor: 'rgba(234, 78, 215, 0.4)',
  },
  link: {
    color: '#1877f2',
    textAlign: 'center',
    '& a': {
      color: '#1877f2',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  polices: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
    '& a': {
      color: '#1c1e21',
      fontSize: '12px',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  divider: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
  createAccountBtn: {
    marginTop: theme.spacing(2),
    padding: '10px 16px',
    backgroundColor: '#42b72a',
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '17px',
    '&:hover': {
      backgroundColor: '#36a420',
    },
  },
}));
