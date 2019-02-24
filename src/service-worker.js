const VERSION = '0.72.3';
const CACHE_NAME = `localWeather-io-${VERSION}`;
const cacheAlways = [
  '.',
  './index.html',
  './offline.html',
  './images/weather-icon-64.png',
  './manifest.json',
  './fonts/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff0GmDuXMRw.woff2',
  './fonts/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDuXMRw.woff2',
  './fonts/z7NHdQDnbTkabZAIOl9il_O6KJj73e7Fd_-7suD8Rb2V.woff2',
  './css/styles.css',
  './js/bundle.js',
  './js/vendors~main.bundle.js',
];
const cacheWhenPossible = [
  './images/weather-icon-32.png',
  './images/weather-icon-48.png',
  './images/weather-icon-72.png',
  './images/weather-icon-96.png',
  './images/weather-icon-128.png',
  './images/weather-icon-512.png',
];

/* eslint-disable */
addEventListener('install', (installEvent) => {
  // console.info(`[SW] Begin Installing New Version ${CACHE_NAME}`);
  self.skipWaiting();
  // perform install steps
  installEvent.waitUntil(
    caches.open(CACHE_NAME)
    .then((staticCache) => {
      // Nice to have cached
      staticCache.addAll(cacheWhenPossible).then(() => {
        // console.info('[SW] Cached the 'nice to haves'');
      }); // end addAll/then
      // Must have cached
      return staticCache.addAll(cacheAlways).then(() => {
        // console.info('[SW] Cached the 'must haves'');
        // console.info(`[SW] Finished Updating LocalWeather.io ${CACHE_NAME}`);
      }); // end return addAll/then
    }) // end open then
  ); // end waitUntil
}); // end addEventListener

addEventListener('activate', (activateEvent) => {
  // console.info('[SW] Activate Started');
  activateEvent.waitUntil(
    caches.keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames
        .filter(cacheName => cacheName !== CACHE_NAME)
        .map((cacheName) => {
          // console.info(`[SW] Deleted Old Version ${cacheName}`);
          return caches.delete(cacheName);
        }) // end map
      ); // end return Promise.all
    }) // end keys then
    .then(() => {
      // console.info('[SW] Activated');
      return clients.claim();
    }) // end then
  ); // end waitUntil
}); // end addEventListener

// intercept network requests
self.addEventListener('fetch', (event) => {
  // console.info('[SW] Fetch Started');
  if (
    (event.request.url !== 'https://www.googletagmanager.com/gtag/js?id=UA-461185-33') &&
    (!event.request.url.includes('/.netlify/functions/'))
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // cache hit - return response
        if (response) {
          // console.info(`[SW] Served from Cache ${event.request.url}`);
          return response;
        }
        // clone the request because it's a one time use stream
        const fetchRequest = event.request.clone();
        // console.info(`[SW] Fetched ${event.request.url}`);
        return fetch(fetchRequest).then((response) => {
          // check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // clone the response because it's a one time use stream
          const responseToCache = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
              // console.info(`[SW] Added to Cache ${event.request.url}`);
              cache.put(event.request, responseToCache);
            })
          );
          return response;
        }).catch((error) => {
          console.log(error, event.request.url);
        });
      })
    );
  }
});
