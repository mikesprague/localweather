"use strict";

module.exports = {
  appName: "LocalWeather.io",
  author: "Michael Sprague",
  cacheTimeKey: "cacheTime",
  cacheTimeSpan: 600, // 10 minutes (number of minutes * 60 seconds)
  coordsDataKey: "coordsData",
  description: "Minimalist local weather app powered by Dark Sky",
  errorMessageSelector: ".error-message",
  geolocationOptions: {
    enableHighAccuracy: true,
    maximumAge: 30000 // 30 seconds (number of seconds * 1000 milliseconds)
  },
  hideClassName: "hidden",
  keywords: "weather, local, dark sky, localweather.io, local weather",
  lat: 0,
  lng: 0,
  loadFromCache: false,
  loadingSpinnerSelector: ".loading-message",
  loadingText: "... loading weather data for your location ...",
  locationDataKey: "locationData",
  locationNameDataKey: "locationName",
  locationName: "",
  offlineHeading: "You appear to be offline",
  offlineText: "This page will automatically update with current weather data when you have a stable connection again",
  themeColor: "#133150",
  timerHandle: 0,
  title: "LocalWeather.io (powered by Dark Sky)",
  versionString: "v0.34.1",
  weatherDataKey: "weatherData",
  apiUrl: function () {
    return window.location.hostname === "localhost" ? "http://localhost:9000" : `https://${window.location.hostname}/.netlify/functions`;
  },
  canonical: function () {
    return `https://${window.location.hostname}/`;
  },
  isOnline: function () {
    return navigator.onLine;
  }
};
