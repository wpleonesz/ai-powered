import { useEffect } from 'react';

// Componente para mejorar la compatibilidad con iOS en PWA
const IOSPWASupport = () => {
  useEffect(() => {
    // Detectar si es un dispositivo iOS
    const isIOS = () => {
      return (
        [
          'iPad Simulator',
          'iPhone Simulator',
          'iPod Simulator',
          'iPad',
          'iPhone',
          'iPod',
        ].includes(navigator.platform) ||
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
      );
    };

    // Detectar si se está ejecutando como PWA en iOS
    const isIOSStandalone = () => {
      return isIOS() && window.navigator.standalone === true;
    };

    if (isIOS()) {
      console.log('Dispositivo iOS detectado');

      // Notificar al service worker que estamos en iOS
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'IS_IOS_DEVICE',
        });
      }

      // Instrucciones para instalar en iOS
      if (
        !isIOSStandalone() &&
        !sessionStorage.getItem('iosInstallPromptShown')
      ) {
        // Mostrar instrucciones solo una vez por sesión
        sessionStorage.setItem('iosInstallPromptShown', 'true');

        // Mostrar instrucciones para instalar la PWA en iOS
        setTimeout(() => {
          const iosPrompt = document.createElement('div');
          iosPrompt.style.position = 'fixed';
          iosPrompt.style.bottom = '20px';
          iosPrompt.style.left = '50%';
          iosPrompt.style.transform = 'translateX(-50%)';
          iosPrompt.style.backgroundColor = '#fff';
          iosPrompt.style.borderRadius = '8px';
          iosPrompt.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
          iosPrompt.style.padding = '15px';
          iosPrompt.style.maxWidth = '90%';
          iosPrompt.style.width = '340px';
          iosPrompt.style.zIndex = '9999';
          iosPrompt.style.fontSize = '14px';
          iosPrompt.style.textAlign = 'center';

          iosPrompt.innerHTML = `
            <div style="display:flex;align-items:center;margin-bottom:10px;">
              <div style="font-size:24px;margin-right:10px;">📱</div>
              <div style="font-weight:bold;flex:1;">Instalar aplicación</div>
              <div style="cursor:pointer;padding:5px;font-size:16px;" onclick="this.parentNode.parentNode.remove()">✕</div>
            </div>
            <p style="margin:0 0 10px;">Para una mejor experiencia, instala esta app en tu dispositivo.</p>
            <p style="margin:0 0 5px;">1. Toca <strong>Compartir</strong> <span style="font-size:18px;">⎋</span> en Safari</p>
            <p style="margin:0;">2. Selecciona <strong>"Añadir a la pantalla de inicio"</strong></p>
          `;

          document.body.appendChild(iosPrompt);

          // Auto-ocultar después de 15 segundos
          setTimeout(() => {
            if (document.body.contains(iosPrompt)) {
              iosPrompt.remove();
            }
          }, 15000);
        }, 3000);
      }

      // Fix para ViewPort en iOS PWA
      if (isIOSStandalone()) {
        // Corregir problemas de viewport en PWA iOS
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
          viewportMeta.content =
            'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover';
        }

        // Fix para scrolling en iOS
        document.documentElement.style.height = '100vh';
        document.body.style.height = '100vh';
        document.body.style.overscrollBehavior = 'none';
      }
    }
  }, []);

  // Este componente no renderiza nada visible
  return null;
};

export default IOSPWASupport;
