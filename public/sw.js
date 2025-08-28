// Este es un Service Worker personalizado para la PWA
// Con optimizaciones específicas para iOS

// Nombre de la caché para la app
const CACHE_NAME = 'uea-base-v1';

// URLs para precachear - añade aquí archivos estáticos importantes
const urlsToCache = [
  '/',
  '/index.js',
  '/manifest.json',
  '/favicon.ico',
  '/assets/icons/apple-icon-152x152.png',
  '/assets/icons/apple-icon-180x180.png',
];

// Función para sincronizar datos cuando hay conexión
const syncData = async () => {
  // Aquí puedes implementar la lógica para sincronizar datos
  // cuando el usuario recupere la conexión a Internet
  console.log('Sincronizando datos...');

  // En iOS debemos ser más persistentes con el almacenamiento
  // porque el navegador puede limpiar la caché más agresivamente
  try {
    const cache = await caches.open(CACHE_NAME);
    console.log('Actualizando caché para iOS...');
    // Recachear los recursos críticos
    await cache.addAll(urlsToCache);
  } catch (error) {
    console.error('Error al actualizar la caché:', error);
  }
};

// Esta parte del código se ejecuta cuando el Service Worker se está instalando
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Caché abierta');
        // Precachear recursos importantes
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Asegura que el service worker tome el control inmediatamente
        return self.skipWaiting();
      }),
  );
});

// Esta parte del código se ejecuta cuando el Service Worker se activa
self.addEventListener('activate', (event) => {
  // Limpiar cachés antiguas
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Eliminando caché antigua:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        // Toma el control de todas las páginas inmediatamente
        return self.clients.claim();
      }),
  );
});

// Maneja la sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Estrategia específica para iOS: Cache primero, luego red
// Esto ayuda a que la app sea más rápida en iOS y funcione mejor offline
self.addEventListener('fetch', (event) => {
  // Excluir solicitudes que no son GET o no son HTTPS/HTTP
  if (
    event.request.method !== 'GET' ||
    !(
      event.request.url.startsWith('http://') ||
      event.request.url.startsWith('https://')
    )
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si encontramos una respuesta en caché, la devolvemos
      if (response) {
        // En segundo plano, actualizamos la caché
        fetch(event.request)
          .then((freshResponse) => {
            // Actualiza la caché con la nueva respuesta
            if (freshResponse && freshResponse.status === 200) {
              const responseToCache = freshResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
          })
          .catch(() => {
            // Error de red, pero tenemos la respuesta en caché
            console.log('Error al actualizar recurso en caché');
          });

        return response;
      }

      // Si no está en caché, solicitamos a la red
      return fetch(event.request)
        .then((response) => {
          // Si la respuesta no es válida, devolvemos tal cual
          if (!response || response.status !== 200) {
            return response;
          }

          // Clonar la respuesta para cachearla y devolverla
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Si falla la red, intentamos servir una página offline si existe
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
          }
          // O devolvemos un error genérico
          return new Response('No hay conexión a internet', {
            status: 503,
            statusText: 'Servicio no disponible',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
    }),
  );
});

// Detección específica de dispositivos iOS para adaptar comportamiento
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'IS_IOS_DEVICE') {
    // Podemos ajustar estrategias específicas para iOS
    console.log('Optimizando PWA para dispositivo iOS');

    // Forzar una actualización de la caché en iOS
    syncData();
  }
});
