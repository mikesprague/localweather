import { version } from '../../package.json';

export const defaults = {
  appName: 'LocalWeather.dev',
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
  iconMap: {
    'clear-day': 'fad fa-fw fa-sun',
    'clear-night': 'fad fa-fw fa-moon-stars',
    rain: 'fad fa-fw fa-cloud-rain',
    snow: 'fad fa-fw fa-cloud-snow',
    sleet: 'fad fa-fw fa-cloud-sleet',
    wind: 'fad fa-fw fa-wind',
    fog: 'fad fa-fw fa-fog',
    cloudy: 'fad fa-fw fa-clouds',
    'partly-cloudy-day': 'fad fa-fw fa-clouds-sun',
    'partly-cloudy-night': 'fad fa-fw fa-clouds-moon',
    hail: 'fad fa-fw fa-cloud-hail',
    hurricane: 'fad fa-fw fa-hurricane',
    thunderstorm: 'fad fa-fw fa-thunderstorm',
    tornado: 'fad fa-fw fa-tornado',
  },
  keywords: 'weather, local, dark sky, localweather.dev, local weather',
  loadingSpinnerSelector: '.loading-message',
  loadingText: '... loading weather data for your location ...',
  locationDataKey: 'locationData',
  locationAddressDataKey: 'locationAddress',
  locationNameDataKey: 'locationName',
  skipGeolocationCheckKey: 'skipLocationCheck',
  temperatureUnitsKey: 'tempUnits',
  temperatureDefaultUnitsKey: 'tempDefaultUnits',
  themeColor: '#133150',
  title: 'LocalWeather.dev (powered by Dark Sky)',
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
  versionString: `v${version}`,
  weatherDataKey: 'weatherData',
};
