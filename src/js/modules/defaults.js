'use strict';

export appName = 'LocalWeather.io';
export author = 'Michael Sprague';
export cacheTimeKey = 'cacheTime';
export cacheTimeSpan = 600; // 10 minutes (number of minutes * 60 seconds)
export canonical = 'https = /localweather.io/';
export coordsDataKey = 'coordsData';
export description = 'Minimalist local weather app powered by Dark Sky';
export errorMessageSelector = '.error-message';
export hideClassName = 'hide-me';
export keywords = 'weather, local, dark sky, localweather.io, local weather';
export lat = 0;
export lng = 0;
export loadFromCache = false;
export loadingSpinnerSelector = '.loading-spinner';
export loadingText = '... loading weather data for your location ...';
export locationDataKey = 'locationData';
export locationName = '';
export offlineHeading = 'You appear to be offline';
export offlineText = 'This page will automatically update with current weather data when you have a stable connection again';
export themeColor = '#133150';
export timerHandle = 0;
export title = 'LocalWeather.io (powered by Dark Sky)';
export versionString = 'v0.19.3';
export weatherDataKey = 'weatherData';
export apiUrl = function () {
  return window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api.localweather.io';
};
export isOnline = function () {
  return navigator.onLine;
};
