'use strict';

exports.appName = 'LocalWeather.io';
exports.author = 'Michael Sprague';
exports.cacheTimeKey = 'cacheTime';
exports.cacheTimeSpan = 600; // 10 minutes (number of minutes * 60 seconds)
exports.coordsDataKey = 'coordsData';
exports.description = 'Minimalist local weather app powered by Dark Sky';
exports.errorMessageSelector = '.error-message';
exports.hideClassName = 'hide-me';
exports.keywords = 'weather, local, dark sky, localweather.io, local weather';
exports.lat = 0;
exports.lng = 0;
exports.loadFromCache = false;
exports.loadingSpinnerSelector = '.loading-spinner';
exports.loadingText = '... loading weather data for your location ...';
exports.locationDataKey = 'locationData';
exports.locationName = '';
exports.offlineHeading = 'You appear to be offline';
exports.offlineText = 'This page will automatically update with current weather data when you have a stable connection again';
exports.themeColor = '#133150';
exports.timerHandle = 0;
exports.title = 'LocalWeather.io (powered by Dark Sky)';
exports.versionString = 'v0.19.8';
exports.weatherDataKey = 'weatherData';
exports.apiUrl = function () {
  return window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api.localweather.io';
};
exports.canonical = function () {
  return `https://${window.location.hostname}/`;
};
exports.isOnline = function () {
  return navigator.onLine;
};
