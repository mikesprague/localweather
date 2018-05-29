const version = '0.10.0';
const cacheName = `localweather-io-${version}`;
self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
          'https://pro.fontawesome.com/releases/v5.0.13/js/all.js',
          'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700',
          '/public/',
          '/public/index.html',
          '/public/assets/css/styles.css',
          '/public/assets/js/app.js',
          '/public/assets/images/favicons/cloud-refresh.png',
          '/public/assets/images/favicons/clear-day.png',
          '/public/assets/images/favicons/clear-night.png',
          '/public/assets/images/favicons/cloudy.png',
          '/public/assets/images/favicons/fog.png',
          '/public/assets/images/favicons/hail.png',
          '/public/assets/images/favicons/partly-cloudy-day.png',
          '/public/assets/images/favicons/partly-cloudy-night.png',
          '/public/assets/images/favicons/rain.png',
          '/public/assets/images/favicons/sleet.png',
          '/public/assets/images/favicons/snow.png',
          '/public/assets/images/favicons/thunderstorm.png',
          '/public/assets/images/favicons/tornado.png',
          '/public/assets/images/favicons/wind.png',
        ])
        .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
    .then(cache => cache.match(event.request, {
      ignoreSearch: true
    }))
    .then(response => {
      return response || fetch(event.request);
    })
  );
});
