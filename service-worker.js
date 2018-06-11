const version = '0.12.3';
const cacheName = `localWeather-io-${version}`;
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
  const timeStamp = Date.now();
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // console.log('event.request', event.request);
      if (response) {
        // console.log('FROM cache:', response.url, response.body);
        return response;
      }
      // console.log('NOT using cache:', event.request.url);
      let fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(response => {
        // console.log(response)
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        let responseToCache = response.clone();
        caches.open(cacheName).then(cache => {
          cache.put(event.request, responseToCache);
          // console.log('JUST cached:', event.request.url);
        });
        return response;
      });
    })
  );
});
