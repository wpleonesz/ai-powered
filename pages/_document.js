import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import theme from '@styles/theme';

// Resuelve problema de hidratación con Material-UI

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // Resolución de la hidratación de Material-UI
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    // Aplicar optimización solo para renderizado inicial
    ctx.renderPage = () =>
      originalRenderPage({
        // Embellecer el componente raíz de la aplicación con hojas de estilo del servidor
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    // Resolver las props iniciales
    const initialProps = await Document.getInitialProps(ctx);

    // Devolver las props con los estilos
    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  }

  render() {
    return (
      <Html lang="es">
        <Head>
          {/* PWA primary color */}
          <meta charSet="utf-8" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta
            name="description"
            content="Aplicación base de la Universidad Estatal Amazónica"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="apple-mobile-web-app-title" content="UEA Base" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-TileColor"
            content={theme.palette.primary.main}
          />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="apple-touch-fullscreen" content="yes" />

          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/assets/icons/icon-192x192.png" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/assets/icons/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/assets/icons/apple-icon-180x180.png"
          />
          <link
            rel="apple-touch-startup-image"
            href="/assets/icons/apple-splash-2048-2732.png"
            media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/assets/icons/apple-splash-1668-2388.png"
            media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/assets/icons/apple-splash-1536-2048.png"
            media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/assets/icons/apple-splash-1125-2436.png"
            media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/assets/icons/apple-splash-828-1792.png"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/assets/icons/apple-splash-750-1334.png"
            media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/assets/icons/icon-72x72.png"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@200;300;400;600;700;900&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
