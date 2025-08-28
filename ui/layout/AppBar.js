import MuiAppBar from '@material-ui/core/AppBar';
import { styled } from '@material-ui/core/styles';

const drawerWidth = 300;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  background: 'linear-gradient(45deg, #6A0DAD 30%, #8A2BE2 90%)', // Degradado púrpura moderno
  boxShadow: '0 4px 10px rgba(106, 13, 173, 0.15)', // Sombra púrpura sutil
  ...(open && {
    // width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default AppBar;
