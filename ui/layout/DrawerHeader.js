import { styled } from '@material-ui/core/styles';

const DrawerHeader = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: -20,
  zIndex: 999,
  display: 'flex',
  alignItems: 'center',
  width: 300,
  height: 60, // Altura fija para evitar desbordamientos
  borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
  padding: theme.spacing(0, 0, 0, 1), // Padding izquierdo solamente
  ...theme.mixins.toolbar,
  justifyContent: 'space-between', // Distribuye el espacio entre el contenido y el botón de cierre
  background: 'linear-gradient(45deg, #6A0DAD 30%, #8A2BE2 90%)', // Degradado púrpura moderno
  overflow: 'hidden', // Evitar desbordamiento del contenido
  boxShadow: '0 4px 10px rgba(106, 13, 173, 0.15)', // Sombra púrpura sutil
}));

export default DrawerHeader;
