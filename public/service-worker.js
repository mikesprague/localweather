const version = '0.10.1';
const cacheName = `localweather-io-${version}`;
self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700',
        './',
        './index.html',
        './assets/css/bootstrap.min.css',
        './assets/css/weather-icons.min.css',
        './assets/css/weather-icons-wind.min.css',
        './assets/font/weathericons-regular-webfont.woff2',
        './assets/font/weathericons-regular-webfont.woff',
        './assets/font/weathericons-regular-webfont.ttf',
        './assets/font/weathericons-regular-webfont.svg',
        './assets/font/weathericons-regular-webfont.eot',
        './assets/css/styles.css',
        './assets/js/fontawesome-all.min.js',
        './assets/js/tippy.all.min.js',
        './assets/js/app.js',
        './assets/images/favicons/cloud-refresh.png',
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      // Cache hit - return response
      if (response) {
        console.log('using cache:', response.url, response.body);
        return response;
      }
      console.log('NOT using cache:', event.request.url);
      return fetch(event.request);
      // return response || fetch(event.request);
    }).catch(function () {
      // If both fail, show a generic fallback:
      return caches.match('./offline.html');
      // However, in reality you'd have many different
      // fallbacks, depending on URL & headers.
      // Eg, a fallback silhouette image for avatars.
    })

  );
});
