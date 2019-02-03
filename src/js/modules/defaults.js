module.exports = {
  appName: 'LocalWeather.io',
  author: 'Michael Sprague',
  cacheTimeKey: 'cacheTime',
  cacheTimeSpan: 300, // 5 minutes (number of minutes * 60 seconds)
  description: 'Minimalist local weather app powered by Dark Sky',
  errorMessageSelector: '.error-message',
  geolocationOptions: {
    enableHighAccuracy: true,
    maximumAge: 30000, // 30 seconds (number of seconds * 1000 milliseconds)
  },
  hideClassName: 'hidden',
  keywords: 'weather, local, dark sky, localweather.io, local weather',
  loadFromCache: false,
  loadingSpinnerSelector: '.loading-message',
  loadingText: '... loading weather data for your location ...',
  locationDataKey: 'locationData',
  locationNameDataKey: 'locationName',
  locationName: '',
  offlineHeading: 'You appear to be offline',
  offlineText: 'This page will automatically update with current weather data when you have a stable connection again',
  themeColor: '#133150',
  timerHandle: 0,
  title: 'LocalWeather.io (powered by Dark Sky)',
  versionString: 'v0.67.5',
  weatherDataKey: 'weatherData',
  apiUrl() {
    return window.location.hostname === 'localhost' ? 'http://localhost:9000' : `https://${window.location.hostname}/.netlify/functions`;
  },
  canonical() {
    return `https://${window.location.hostname}/`;
  },
  isOnline() {
    return navigator.onLine;
  },
  iconMap: {
    'clear-day': 'fal fa-fw fa-sun',
    'clear-night': 'fal fa-fw fa-moon-stars',
    rain: 'fal fa-fw fa-cloud-rain',
    snow: 'fal fa-fw fa-cloud-snow',
    sleet: 'fal fa-fw fa-sleet',
    wind: 'fal fa-fw fa-wind',
    fog: 'fal fa-fw fa-fog',
    cloudy: 'fal fa-fw fa-clouds',
    'partly-cloudy-day': 'fal fa-fw fa-clouds-sun',
    'partly-cloudy-night': 'fal fa-fw fa-clouds-moon',
    hail: 'fal fa-fw fa-cloud-hail',
    hurricane: 'fal fa-fw fa-hurricane',
    thunderstorm: 'fal fa-fw fa-thunderstorm',
    tornado: 'fal fa-fw fa-tornado',
  },
  unitLabels: {
    nearestStormDistance: {
      us: ['mi', 'miles'],
      si: ['km', 'kilometers'],
      uk2: ['mi', 'miles'],
      ca: ['km', 'kilometers'],
    },
    precipIntensity: {
      us: ['in/h', 'inches per hour'],
      si: ['mm/h', 'millimeters per hour'],
      uk2: ['mm/h', 'millimeters per hour'],
      ca: ['mm/h', 'millimeters per hour'],
    },
    precipIntensityMax: {
      us: ['in/h', 'inches per hour'],
      si: ['mm/h', 'millimeters per hour'],
      uk2: ['mm/h', 'millimeters per hour'],
      ca: ['mm/h', 'millimeters per hour'],
    },
    precipAccumulation: {
      us: ['in', 'inches'],
      si: ['cm', 'centimeters'],
      uk2: ['cm', 'centimeters'],
      ca: ['cm', 'centimeters'],
    },
    windSpeed: {
      us: ['mph', 'miles per hour'],
      si: ['mps', 'meters per second'],
      uk2: ['mph', 'miles per hour'],
      ca: ['kph', 'kilometers per hour'],
    },
    windGust: {
      us: ['mph', 'miles per hour'],
      si: ['mps', 'meters per second'],
      uk2: ['mph', 'miles per hour'],
      ca: ['kph', 'kilometers per hour'],
    },
    pressure: {
      us: ['mb', 'millibats'],
      si: ['hPa', 'hectopascals'],
      uk2: ['hPa', 'hectopascals'],
      ca: ['hPa', 'hectopascals'],
    },
    visibility: {
      us: ['mi', 'miles'],
      si: ['km', 'kilometers'],
      uk2: ['mi', 'miles'],
      ca: ['km', 'kilometers'],
    },
  },
};
