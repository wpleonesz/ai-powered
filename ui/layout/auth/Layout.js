import Image from 'next/image';
import { Grid, Typography } from '@material-ui/core';
import { useStyles } from '@ui/layout/auth/styles';
import Link from '@mui/material/Link';

const Signin = ({
  children,
  logo,
  institution,
  forgot = true,
  showLeftColumn = true,
}) => {
  const classes = useStyles();
  // Usar el año estático para evitar diferencias entre servidor y cliente
  const currentYear = 2025; // En lugar de new Date().getFullYear()

  return (
    <Grid className={classes.wrap}>
      <Grid item container xs={12} className={classes.main}>
        <Grid item container className={classes.container}>
          {/* Columna izquierda - Logo e información (condicional) */}
          {showLeftColumn && (
            <Grid item className={classes.logoContainer}>
              <Image
                width="106"
                height="106"
                layout="fixed"
                src={
                  logo && logo.startsWith('/')
                    ? logo
                    : logo
                    ? `/${logo}`
                    : '/assets/images/react.png'
                }
                alt="uea_logo"
                priority
              />
              <Grid className={classes.titleContainer}>
                <Typography variant="h5" component="h1">
                  {institution || 'Universidad Estatal Amazónica'}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  className="subtitle"
                >
                  Portal Transaccional UEA te conecta con tus compañeros y las
                  herramientas que necesitas para tu vida académica.
                </Typography>
              </Grid>
            </Grid>
          )}

          {/* Columna derecha - Formulario */}
          <Grid
            item
            className={`${classes.formContainer} ${
              !showLeftColumn ? classes.formContainerFullWidth : ''
            }`}
          >
            <Grid item container className={classes.childrenContainer}>
              {children}
            </Grid>

            <Grid item container className={classes.linksContainer}>
              <Grid
                item
                container
                justifyContent="center"
                className={classes.link}
              >
                {forgot && (
                  <Link href="/auth/recover" variant="body2" component="a">
                    ¿Olvidaste tu contraseña?
                  </Link>
                )}
              </Grid>

              <Grid
                item
                container
                justifyContent="center"
                className={classes.polices}
              >
                <Link
                  href="/policies"
                  variant="body2"
                  component="a"
                  style={{ marginRight: '15px' }}
                >
                  Política de Privacidad
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container className={classes.copyrightContainer}>
        Copyright © Universidad Estatal Amazónica {currentYear}
      </Grid>
    </Grid>
  );
};

export default Signin;
