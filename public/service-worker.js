const version = '0.10.1';
const cacheName = `localweather-io-${version}`;
self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
          'https://pro.fontawesome.com/releases/v5.0.13/js/all.js',
          'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700',
          '/',
          '/index.html',
          '/assets/css/styles.css',
          '/assets/js/app.js',
          '/assets/images/favicons/cloud-refresh.png',
          '/assets/images/favicons/clear-day.png',
          '/assets/images/favicons/clear-night.png',
          '/assets/images/favicons/cloudy.png',
          '/assets/images/favicons/fog.png',
          '/assets/images/favicons/hail.png',
          '/assets/images/favicons/partly-cloudy-day.png',
          '/assets/images/favicons/partly-cloudy-night.png',
          '/assets/images/favicons/rain.png',
          '/assets/images/favicons/sleet.png',
          '/assets/images/favicons/snow.png',
          '/assets/images/favicons/thunderstorm.png',
          '/assets/images/favicons/tornado.png',
          '/assets/images/favicons/wind.png',
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
