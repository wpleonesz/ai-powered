import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import store from '@redux/store';
import theme from '@styles/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  const Layout = Component.Layout || EmptyLayout;

  // Registrar el service worker para PWA
  // Efecto para registrar el service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registrado con éxito:', registration);
          })
          .catch((registrationError) => {
            console.log(
              'Registro de Service Worker fallido:',
              registrationError,
            );
          });
      });
    }
  }, []);

  // Efecto para cargar componentes PWA del lado del cliente
  useEffect(() => {
    // Cargar componentes PWA dinámicamente solo en el cliente
    if (typeof window !== 'undefined') {
      const loadPWAComponents = async () => {
        try {
          const InstallPWAModule = await import('../components/pwa/InstallPWA');
          const IOSPWASupportModule = await import(
            '../components/pwa/IOSPWASupport'
          );
          // No necesitamos hacer nada con los módulos, solo cargarlos
        } catch (err) {
          console.error('Error al cargar componentes PWA:', err);
        }
      };
      loadPWAComponents();
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>UEA | Base</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1.0, width=device-width, height=device-height"
        />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            <SnackbarProvider maxSnack={3}>
              <>
                {/* Usamos useEffect para cargar los componentes cliente-side */}
                <Component {...pageProps} />
              </>
            </SnackbarProvider>
          </Layout>
        </ThemeProvider>
      </Provider>
    </React.Fragment>
  );
}

const EmptyLayout = ({ children }) => <>{children} </>;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
