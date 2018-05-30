const version = '0.11.6';
const cacheName = `localWeather-io-${version}`;
self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
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
        `https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700`,
        `https://fonts.gstatic.com/s/opensanscondensed/v12/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDuXMR7eS2Ao.woff2`,
        `https://fonts.gstatic.com/s/opensanscondensed/v12/z7NHdQDnbTkabZAIOl9il_O6KJj73e7Fd_-7suD8Rb2V-ggZSw.woff2`,
        `https://fonts.gstatic.com/s/opensanscondensed/v12/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff0GmDuXMR7eS2Ao.woff2`,
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
