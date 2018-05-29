const version = '0.11.5';
const cacheName = `localWeather-io-${version}`;
self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        `https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700`,
        `/`,
        `/index.html`,
        `/assets/css/bootstrap.min.css`,
        `/assets/css/weather-icons.min.css`,
        `/assets/css/weather-icons-wind.min.css`,
        `/assets/font/weathericons-regular-webfont.woff2`,
        `/assets/font/weathericons-regular-webfont.woff`,
        `/assets/font/weathericons-regular-webfont.ttf`,
        `/assets/font/weathericons-regular-webfont.svg`,
        `/assets/font/weathericons-regular-webfont.eot`,
        `/assets/css/styles.css`,
        `/assets/js/fontawesome-all.min.js`,
        `/assets/js/tippy.all.min.js`,
        `/assets/js/app.js`,
        `/assets/images/favicons/weather-icon-32.png`,
        `/assets/images/favicons/weather-icon-48.png`,
        `/assets/images/favicons/weather-icon-64.png`,
        `/assets/images/favicons/weather-icon-72.png`,
        `/assets/images/favicons/weather-icon-96.png`,
        `/assets/images/favicons/weather-icon-128.png`,
        `/assets/images/favicons/weather-icon-512.png`,
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
      return response || fetch(event.request);
    })
  );
});
