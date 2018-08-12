'use strict';

module.exports = {
  appName: 'LocalWeather.io',
  author: 'Michael Sprague',
  cacheTimeKey: 'cacheTime',
  cacheTimeSpan: 600, // 10 minutes (number of minutes * 60 seconds)
  coordsDataKey: 'coordsData',
  description: 'Minimalist local weather app powered by Dark Sky',
  errorMessageSelector: '.error-message',
  hideClassName: 'hide-me',
  keywords: 'weather, local, dark sky, localweather.io, local weather',
  lat: 0,
  lng: 0,
  loadFromCache: false,
  loadingSpinnerSelector: '.loading-spinner',
  loadingText: '... loading weather data for your location ...',
  locationDataKey: 'locationData',
  locationName: '',
  offlineHeading: 'You appear to be offline',
  offlineText: 'This page will automatically update with current weather data when you have a stable connection again',
  themeColor: '#133150',
  timerHandle: 0,
  title: 'LocalWeather.io (powered by Dark Sky)',
  versionString: 'v0.21.3',
  weatherDataKey: 'weatherData',
  apiUrl: function () {
    return window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api.localweather.io';
  },
  canonical: function () {
    return `https://${window.location.hostname}/`;
  },
  isOnline: function () {
    return navigator.onLine;
  }
}
