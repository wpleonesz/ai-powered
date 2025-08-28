import { styled } from '@material-ui/core/styles';
import { isMobile } from 'react-device-detect';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    backgroundColor: '#F8F9FA', // Fondo gris muy claro para un aspecto limpio
    minHeight: '100vh', // Asegurar que cubre toda la altura
    backgroundImage:
      'linear-gradient(rgba(106, 13, 173, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(106, 13, 173, 0.02) 1px, transparent 1px)',
    backgroundSize: '20px 20px', // Patrón de rejilla sutil
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `5px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: isMobile ? 0 : 280,
    }),
  }),
);

export default Main;
