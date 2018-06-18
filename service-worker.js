const VERSION = '0.13.4';
const CACHE_NAME = `localWeather-io-${VERSION}`;
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/dist/css/styles.css',
  '/dist/js/bundle.js',
  '/assets/css/weather-icons.min.css',
  '/assets/css/weather-icons-wind.min.css',
  '/assets/images/favicons/weather-icon-32.png',
  '/assets/images/favicons/weather-icon-48.png',
  '/assets/images/favicons/weather-icon-64.png',
  '/assets/images/favicons/weather-icon-72.png',
  '/assets/images/favicons/weather-icon-96.png',
  '/assets/images/favicons/weather-icon-128.png',
  '/assets/images/favicons/weather-icon-512.png',
  '/assets/font/weathericons-regular-webfont.woff2',
  '/assets/font/weathericons-regular-webfont.woff',
  '/assets/font/weathericons-regular-webfont.ttf',
  '/assets/font/weathericons-regular-webfont.svg',
  '/assets/font/weathericons-regular-webfont.eot',
  '/assets/js/fontawesome-all.min.js',
  'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700',
  'https://fonts.gstatic.com/s/opensanscondensed/v12/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDuXMR7eS2Ao.woff2',
  'https://fonts.gstatic.com/s/opensanscondensed/v12/z7NHdQDnbTkabZAIOl9il_O6KJj73e7Fd_-7suD8Rb2V-ggZSw.woff2',
  'https://fonts.gstatic.com/s/opensanscondensed/v12/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff0GmDuXMR7eS2Ao.woff2'
];

self.addEventListener('install', event => {
  console.log('[SW] Install Started');
  self.skipWaiting();
  clients.claim();
  // perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(urlsToCache).then(() => {
        console.log(`[SW] Install Complete ${CACHE_NAME}`);
      })
    )
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate Started');
  // delete the old caches
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
        // filter for caches that aren't the current one
        .filter(cacheName => cacheName !== CACHE_NAME)
        // map over them and delete them
        .map(cacheName => caches.delete(cacheName).then(() => {
          console.log(`[SW] Deleted Cache ${cacheName}`);
        }))
      ).then(() => {
        console.log('[SW] Activated');
      })
    )
  );
});

// intercept network requests
self.addEventListener('fetch', event => {
  console.log('[SW] Fetch Started');
  event.respondWith(
    caches.match(event.request).then(response => {
      // cache hit - return response
      if (response) {
        console.info(`[SW] Served from Cache ${event.request.url}`);
        return response;
      }
      // clone the request because it's a one time use stream
      const fetchRequest = event.request.clone();
      console.log(`[SW] Fetched ${event.request.url}`);
      return fetch(fetchRequest).then(response => {
        // check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // clone the response because it's a one time use stream
        const responseToCache = response.clone();
        event.waitUntil(
          caches.open(CACHE_NAME).then(cache => {
            console.log(`[SW] Added to Cache ${event.request.url}`);
            cache.put(event.request, responseToCache);
          })
        );
        return response;
      }).catch(error => {
        // console.error('[SW] Error', error);
        return caches.match('/offline.html');
      });
    })
  );
});
