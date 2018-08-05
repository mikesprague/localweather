const VERSION = '0.19.4';
const CACHE_NAME = `localWeather-io-${VERSION}`;
const cacheAlways = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/bundle.js',
  '/assets/css/weather-icons.min.css',
  '/assets/css/weather-icons-wind.min.css',
  '/assets/font/weathericons-regular-webfont.woff2',
  '/assets/font/weathericons-regular-webfont.woff',
  '/assets/font/weathericons-regular-webfont.ttf',
  '/assets/font/weathericons-regular-webfont.svg',
  '/assets/font/weathericons-regular-webfont.eot',
];
const cacheWhenPossible = [
  '/assets/images/favicons/weather-icon-32.png',
  '/assets/images/favicons/weather-icon-48.png',
  '/assets/images/favicons/weather-icon-64.png',
  '/assets/images/favicons/weather-icon-72.png',
  '/assets/images/favicons/weather-icon-96.png',
  '/assets/images/favicons/weather-icon-128.png',
  '/assets/images/favicons/weather-icon-512.png',
  'https://fonts.googleapis.com/css/family=Open+Sans+Condensed:300,300italic,700',
  'https://fonts.gstatic.com/s/opensanscondensed/v12/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDuXMR7eS2Ao.woff2',
  'https://fonts.gstatic.com/s/opensanscondensed/v12/z7NHdQDnbTkabZAIOl9il_O6KJj73e7Fd_-7suD8Rb2V-ggZSw.woff2',
  'https://fonts.gstatic.com/s/opensanscondensed/v12/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff0GmDuXMR7eS2Ao.woff2',
];

addEventListener('install', installEvent => {
  // console.info(`[SW] Begin Installing New Version ${CACHE_NAME}`);
  self.skipWaiting();
  // perform install steps
  installEvent.waitUntil(
    caches.open(CACHE_NAME)
    .then(staticCache => {
      // Nice to have cached
      staticCache.addAll(cacheWhenPossible).then(() => {
        // console.info('[SW] Cached the "nice to haves"');
      }); // end addAll/then
      // Must have cached
      return staticCache.addAll(cacheAlways).then(() => {
        // console.info('[SW] Cached the "must haves"');
        console.info(`[SW] Finished Updating LocalWeather.io ${CACHE_NAME}`);
      }); // end return addAll/then
    }) // end open then
  ); // end waitUntil
}); // end addEventListener

addEventListener('activate', activateEvent => {
  // console.log('[SW] Activate Started');
  activateEvent.waitUntil(
    caches.keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames
        .filter(cacheName => {
          return cacheName !== CACHE_NAME;
        })
        .map(cacheName => {
          // console.info(`[SW] Deleted Old Version ${cacheName}`);
          return caches.delete(cacheName);
        }) // end map
      ); // end return Promise.all
    }) // end keys then
    .then(() => {
      console.log('[SW] Activated');
      return clients.claim();
    }) // end then
  ); // end waitUntil
}); // end addEventListener

// intercept network requests
self.addEventListener('fetch', event => {
  // console.log('[SW] Fetch Started');
  event.respondWith(
    caches.match(event.request).then(response => {
      // cache hit - return response
      if (response) {
        // console.info(`[SW] Served from Cache ${event.request.url}`);
        return response;
      }
      // clone the request because it's a one time use stream
      const fetchRequest = event.request.clone();
      // console.log(`[SW] Fetched ${event.request.url}`);
      return fetch(fetchRequest).then(response => {
        // check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // clone the response because it's a one time use stream
        const responseToCache = response.clone();
        event.waitUntil(
          caches.open(CACHE_NAME).then(cache => {
            // console.log(`[SW] Added to Cache ${event.request.url}`);
            cache.put(event.request, responseToCache);
          })
        );
        return response;
      });
    })
  );
});
