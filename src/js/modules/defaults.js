'use strict';

export const appName = 'LocalWeather.io';
export const author = 'Michael Sprague';
export const cacheTimeKey = 'cacheTime';
export const cacheTimeSpan = 600; // 10 minutes (number of minutes * 60 seconds)
export const canonical = 'https = /localweather.io/';
export const coordsDataKey = 'coordsData';
export const description = 'Minimalist local weather app powered by Dark Sky';
export const errorMessageSelector = '.error-message';
export const hideClassName = 'hide-me';
export const keywords = 'weather, local, dark sky, localweather.io, local weather';
export let lat = 0;
export let lng = 0;
export let loadFromCache = false;
export const loadingSpinnerSelector = '.loading-spinner';
export let loadingText = '... loading weather data for your location ...';
export const locationDataKey = 'locationData';
export let locationName = '';
export let offlineHeading = 'You appear to be offline';
export let offlineText = 'This page will automatically update with current weather data when you have a stable connection again';
export const themeColor = '#133150';
export let timerHandle = 0;
export let title = 'LocalWeather.io (powered by Dark Sky)';
export const versionString = 'v0.19.2';
export const weatherDataKey = 'weatherData';
export const apiUrl = function () {
  return window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api.localweather.io';
};
export const isOnline = function () {
  return navigator.onLine;
};
