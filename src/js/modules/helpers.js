import { iconMap, unitLabels } from './defaults';

export function apiUrl() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:9000';
  }
  return `https://${window.location.hostname}/.netlify/functions`;
}

export function canonical() {
  return `https://${window.location.hostname}/`;
}

// ex: getUnityLabel('visibility', 'si'); -> returns: ['km', 'kilometers']
export function getUnitLabel(unitType, units) {
  return unitLabels[unitType][units];
}

export function getWeatherIcon(icon) {
  return iconMap[icon];
}

export function handleError(error) {
  if (window.location.hostname === 'localhost') {
    console.error(error);
  } else {
    /* eslint-disable no-undef */
    bugsnagClient.notify(error);
    /* eslint-enable no-undef */
  }
}

export function isOnline() {
  return navigator.onLine;
}

export function reloadWindow() {
  window.location.reload(true);
}
