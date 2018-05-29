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
        // console.log('using cache:', response.url, response.body);
        return response;
      }
      // console.log('NOT using cache:', event.request.url);
      let fetchRequest = event.request.clone();
      console.log('NOT using cache:', event.request.url);
      return fetch(fetchRequest).then(
        function (response) {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          let responseToCache = response.clone();
          caches.open(cacheName).then(function (cache) {
            cache.put(event.request, responseToCache);
            // console.log('Now cached:', event.request.url);
          });
          return response;
        }
      );
    }).catch(function () {
      // TODO: add generic offline page
      // return caches.match('./offline.html');
      console.warn("You appear to be offline");
    })

  );
});
