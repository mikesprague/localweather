import { defaults } from './defaults.js';

export const apiUrl = () => {
  let urlToReturn = `${window.location.protocol}//${window.location.hostname}/api`;

  if (
    window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('127.0.0.1')
  ) {
    urlToReturn = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;
  }
  // console.log(urlToReturn);

  return urlToReturn;
};

export const canonical = () => {
  return `https://${window.location.hostname}/`;
};

// ex: getUnityLabel('visibility', 'si'); -> returns: ['km', 'kilometers']
export const getUnitLabel = (unitType, units) => {
  return defaults.unitLabels[unitType][units];
};

export const getWeatherIcon = (icon) => {
  return defaults.iconMap[icon];
};

export function handleError(error) {
  if (
    window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('127.0.0.1')
  ) {
    console.error(error);
  } else {
    /* eslint-disable no-undef */
    bugsnagClient.notify(error);
    /* eslint-enable no-undef */
  }
}

export const isOnline = () => {
  return navigator.onLine;
};

export const reloadWindow = () => {
  window.location.reload(true);
};
