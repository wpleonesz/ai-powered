import Image from 'next/image';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((_theme) => ({
  logoContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end', // Alinea el contenido hacia la derecha
    alignItems: 'center',
    width: '100%',
    padding: 0, // Elimina el padding
  },
  imageWrapper: {
    position: 'relative',
    width: '75px',
    height: '40px',
    marginRight: -5, // Margen negativo para acercar al texto
  },
}));

const Logo = ({ logo }) => {
  const classes = useStyles();
  // Asegurarnos de que la ruta comience con / o sea una URL completa
  const logoPath = !logo
    ? '/assets/images/image_placeholder.png'
    : logo.startsWith('/') || logo.startsWith('http')
    ? logo
    : `/${logo}`;

  return (
    <Box className={classes.logoContainer}>
      <div className={classes.imageWrapper}>
        <Image
          src={logoPath}
          alt="UEA IMAGES"
          fill
          sizes="160px"
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
          }}
          quality={100}
        />
      </div>
    </Box>
  );
};

export default Logo;
