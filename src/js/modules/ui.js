import tippy from 'tippy.js';
import swal from 'sweetalert2';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faSpinner, faGlobe, faMapMarkerAlt, faExclamationTriangle,
  faArrowAltCircleDown, faArrowAltCircleUp, faBan, faSignal,
  faLongArrowAltDown, faLongArrowAltUp, faExternalLinkAlt,
  faCircle, faPlusSquare, faMinusSquare, faGlobeAfrica, faSyncAlt,
  faTachometer, faAngleUp, faChevronCircleUp, faDewpoint, faHumidity,
  faWind, faSunrise, faSunset, faEye, faUmbrella, faSun, faCloud,
  faThermometerHalf, faInfoCircle,
} from '@fortawesome/pro-solid-svg-icons';
import {
  faTint, faClock, faCode, faWifiSlash,
  faSun as faSunLight, faMoonStars, faCloudRain, faCloudSnow,
  faCloudSleet, faWind as faWIndLight, faFog, faClouds, faCloudsSun,
  faCloudsMoon, faCloudHail, faHurricane, faThunderstorm, faTornado,
  faTemperatureHigh, faTemperatureLow,
} from '@fortawesome/pro-light-svg-icons';
import dayjs from 'dayjs';
import * as defaults from './defaults';
import {
  parseLocationNameFromFormattedAddress,
  getLocationAndPopulateAppData,
} from './data';
import { getData } from './cache';
import {
  populateMessage, populateForecastData,
  populateHourlyData, populateLastUpdated, populateLocation,
  populatePrimaryData, populateWeatherData, populateWeatherAlert,
  populateAppShell,
} from './templates';

export function initFontAwesomeIcons() {
  library.add(
    faAngleUp,
    faArrowAltCircleDown,
    faArrowAltCircleUp,
    faBan,
    faChevronCircleUp,
    faCircle,
    faClock,
    faCloud,
    faCloudHail,
    faCloudRain,
    faClouds,
    faCloudsMoon,
    faCloudSleet,
    faCloudSnow,
    faCloudsSun,
    faCode,
    faDewpoint,
    faExclamationTriangle,
    faExternalLinkAlt,
    faEye,
    faFog,
    faGlobe,
    faGlobeAfrica,
    faHumidity,
    faHurricane,
    faInfoCircle,
    faLongArrowAltDown,
    faLongArrowAltUp,
    faMapMarkerAlt,
    faMinusSquare,
    faMoonStars,
    faPlusSquare,
    faSignal,
    faSpinner,
    faSun,
    faSunLight,
    faSunrise,
    faSunset,
    faSyncAlt,
    faTachometer,
    faTemperatureHigh,
    faTemperatureLow,
    faThermometerHalf,
    faThunderstorm,
    faTint,
    faTornado,
    faUmbrella,
    faWind,
    faWIndLight,
    faWifiSlash,
  );
  dom.watch();
}

export function getMoonUi(data) {
  const averageLunarCycle = 29.53058867;
  const moonAge = Math.round(data.daily.data[0].moonPhase * averageLunarCycle);
  const iconPrefix = 'wi-moon';
  let iconSuffix = '';
  let phaseText = '';
  if (moonAge > 0 && moonAge < 8) {
    iconSuffix = `waxing-crescent-${moonAge}`;
    phaseText = 'Waxing Crescent';
  } else if (moonAge === 8) {
    iconSuffix = 'first-quarter';
    phaseText = 'First Quarter';
  } else if (moonAge > 8 && moonAge < 15) {
    iconSuffix = `waxing-gibbous-${moonAge - 8}`;
    phaseText = 'Waxing Gibbous';
  } else if (moonAge === 15) {
    iconSuffix = 'full';
    phaseText = 'Full Moon';
  } else if (moonAge > 15 && moonAge < 22) {
    iconSuffix = `waning-gibbous-${moonAge - 15}`;
    phaseText = 'Waning Gibbous';
  } else if (moonAge === 22) {
    iconSuffix = 'third-quarter';
    phaseText = 'Third Quarter';
  } else if (moonAge > 22 && moonAge < 29) {
    iconSuffix = `waning-crescent-${moonAge - 22}`;
    phaseText = 'Waning Crescent';
  } else if (moonAge === 29 || moonAge === 0) {
    iconSuffix = 'new';
    phaseText = 'New Moon';
  }
  return {
    icon: `${iconPrefix}-${iconSuffix}`,
    phase: phaseText,
  };
}

export function getTempTrend(data) {
  const now = Math.round(new Date().getTime() / 1000);
  console.log(now);
  console.log(data.daily.data[0].apparentTemperatureHighTime);
  let iconClass = 'fas fa-fw fa-long-arrow-alt-down';
  let iconTransform = 'rotate--30';
  let tempTrendText = 'falling';
  if (now < data.daily.data[0].apparentTemperatureHighTime) {
    iconClass = 'fas fa-fw fa-long-arrow-alt-up';
    iconTransform = 'rotate-45';
    tempTrendText = 'rising';
  }
  return {
    icon: `<i class='${iconClass}' data-fa-transform='${iconTransform}'></i>`,
    iconClass,
    text: tempTrendText,
  };
}

export function getBodyBgClass(data) {
  const now = Math.round(new Date().getTime() / 1000);
  const sunrise = data.daily.data[0].sunriseTime;
  const sunset = data.daily.data[0].sunsetTime;
  const cloudCover = Math.round(data.currently.cloudCover * 100);
  const currentIcon = data.currently.icon;
  const isCloudy = cloudCover > 50;
  const isRaining = (currentIcon === 'rain' || currentIcon === 'thunderstorm');
  const isSnowing = (currentIcon === 'snow' || currentIcon === 'sleet');
  const bodyClassSuffix = (now < sunrise || now >= sunset) ? '-night' : '';
  let bodyClassPrefix = 'clear';
  bodyClassPrefix = isCloudy ? 'cloudy' : bodyClassPrefix;
  bodyClassPrefix = isRaining ? 'rainy' : bodyClassPrefix;
  bodyClassPrefix = isSnowing ? 'snowy' : bodyClassPrefix;

  return `${bodyClassPrefix}${bodyClassSuffix}`;
}

export function setBodyBgClass(className) {
  const bodyEl = document.querySelector('body');
  const htmlEl = document.querySelector('html');
  bodyEl.classList.add(className);
  htmlEl.classList.add(className);
}

export function removeBodyBgClass(className) {
  const bodyEl = document.querySelector('body');
  const htmlEl = document.querySelector('html');
  bodyEl.classList.remove(className);
  htmlEl.classList.remove(className);
}

export function setFavicon(data) {
  const currentIcon = data.currently.icon;
  const iconTags = document.getElementsByClassName('favicon');
  const iconPath = `images/${currentIcon}.png`;
  Array.from(iconTags).forEach((iconTag) => {
    iconTag.setAttribute('href', iconPath);
  });
}

export function setTitle(data) {
  const locationName = getData(defaults.locationNameDataKey);
  const newTitle = `${Math.round(data.currently.temperature)}° ${data.currently.summary} | ${parseLocationNameFromFormattedAddress(locationName)} | ${defaults.title}`;
  window.document.title = newTitle;
}

export function showEl(el) {
  if (el !== 'undefined') {
    switch (typeof el) {
      case 'NodeList':
        Array.from(el).forEach((item) => {
          item.classList.remove(defaults.hideClassName);
        });
        break;
      case 'object':
        if (el.length) {
          Array.from(el).forEach((item) => {
            item.classList.remove(defaults.hideClassName);
          });
        } else if (el.length !== 0) {
          el.classList.remove(defaults.hideClassName);
        }
        break;
      case 'string':
        document.querySelector(el).classList.remove(defaults.hideClassName);
        break;
      default:
        break;
    }
  }
}

export function hideEl(el) {
  if (el !== 'undefined') {
    switch (typeof el) {
      case 'NodeList':
        Array.from(el).forEach((item) => {
          item.classList.add(defaults.hideClassName);
        });
        break;
      case 'object':
        if (el.length) {
          Array.from(el).forEach((item) => {
            item.classList.add(defaults.hideClassName);
          });
        } else if (el.length !== 0) {
          el.classList.add(defaults.hideClassName);
        }
        break;
      case 'string':
        document.querySelector(el).classList.add(defaults.hideClassName);
        break;
      default:
        break;
    }
  }
}

export function initTooltips() {
  tippy('.has-tooltip', {
    a11y: false,
    allowHTML: true,
    arrow: true,
    flipOnUpdate: true,
    interactive: true,
    size: 'large',
    touch: true,
    trigger: 'click', // mouseenter
  });
}

export function hideUi() {
  const rows = document.querySelector('.weather-data');
  const locationName = document.querySelector('.location');
  const hrAll = document.querySelectorAll('hr');
  const initialContent = document.querySelector('.initial-content');
  if (initialContent) { hideEl(initialContent); }
  if (locationName) { hideEl(locationName); }
  if (rows) { hideEl(rows); }
  if (hrAll) { hideEl(hrAll); }
}

export function showUi() {
  const rows = document.querySelector('.weather-data');
  const locationName = document.querySelector('.location');
  const hrAll = document.querySelectorAll('hr');
  if (rows) { showEl(rows); }
  if (locationName) { showEl(locationName); }
  if (hrAll) { showEl(hrAll); }
  initTooltips();
}

export function showLoading(loadingMsg = defaults.loadingText) {
  const loadingSpinner = document.querySelector(defaults.loadingSpinnerSelector);
  setBodyBgClass('loading');
  populateMessage(loadingMsg);
  showEl(loadingSpinner);
  hideUi();
  initFontAwesomeIcons();
}

export function hideLoading() {
  const loadingSpinner = document.querySelector(defaults.loadingSpinnerSelector);
  removeBodyBgClass('loading');
  hideEl(loadingSpinner);
  showUi();
  initFontAwesomeIcons();
}

export function reloadWindow() {
  window.location.reload(true);
}

export function showInstallAlert() {
  swal.fire({
    title: `${defaults.appName}`,
    text: 'Latest Version Installed',
    confirmButtonText: 'Reload for Latest Updates',
    type: 'success',
    onClose: () => {
      reloadWindow();
    },
  });
}

export function showErrorAlert(errorMessage, buttonText = 'Reload to Try Again') {
  hideLoading();
  swal.fire({
    title: `${defaults.appName}`,
    html: `${errorMessage}`,
    confirmButtonText: `${buttonText}`,
    confirmButtonColor: `${defaults.themeColor}`,
    type: 'error',
    onClose: () => {
      reloadWindow();
    },
  });
}

export function hasApprovedLocationSharing() {
  return document.cookie.replace(/(?:(?:^|.*;\s*)approvedLocationSharing\s*=\s*([^;]*).*$)|^.*$/, '$1') === 'true';
}

export function parseWeatherAlert(weatherAlert) {
  const alertParts = weatherAlert.split('*');
  const heading = alertParts.shift().replace(/\.\.\./g, ' ').trim();
  const bodyText = alertParts.join(' ').trim();
  // console.log(weatherAlert);
  // console.log(alertParts);

  let bulletPoints = '';
  if (alertParts.length > 1) {
    bulletPoints = alertParts.filter(part => part.trim().length)
      .map(part => `<li><strong>${part.replace('...', '</strong> ')}</li>`)
      .join('\n');
  }

  return {
    heading,
    bodyText,
    bulletPoints,
  };
}

export function showWeatherAlert(data) {
  /* eslint-disable object-curly-newline */
  const { title, time, expires, description } = data[0];
  /* eslint-enable object-curly-newline */
  const { heading, bulletPoints } = parseWeatherAlert(description);

  swal.fire({
    title: `${title}`,
    html: `
        <div class='content'>
          <p class='weather-alert-heading has-text-left'>${heading}</p>
          <ul class='weather-alert-bullets has-text-left'>
            <li><strong>BEGINS</strong> ${dayjs.unix(time).format('dddd, MMMM D, YYYY at hh:mm:ss A')}</li>
            <li><strong>EXPIRES</strong> ${dayjs.unix(expires).format('dddd, MMMM D, YYYY at hh:mm:ss A')}</li>
            ${bulletPoints}
          </ul>
        </div>
    `,
    confirmButtonText: 'Close',
    confirmButtonColor: `${defaults.themeColor}`,
  });
}

export function initWeatherAlerts(data) {
  const weatherAlerts = data.alerts;
  if (weatherAlerts) {
    populateWeatherAlert(weatherAlerts[0].title);
    showEl('.weather-alert');
    document.querySelector('.link-weather-alert').addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault();
      showWeatherAlert(weatherAlerts);
    });
  }
}

export function refreshLastUpdatedTime(data) {
  populateLastUpdated(data);
}

export function renderAppWithData(data) {
  initFontAwesomeIcons();
  setBodyBgClass(getBodyBgClass(data));
  populateAppShell();
  populatePrimaryData(data);
  populateWeatherData(data);
  populateForecastData(data);
  populateHourlyData(data);
  populateLastUpdated(data);
  populateLocation(data);
  setFavicon(data);
  setTitle(data);
  initTooltips();
  initWeatherAlerts(data);
}

export async function getWeatherDataAndRenderApp(lat, lng) {
  showLoading('... loading weather data ...');
  try {
    const weatherData = await getLocationAndPopulateAppData(lat, lng);
    renderAppWithData(weatherData);
  } catch (error) {
    /* eslint-disable no-undef */
    bugsnagClient.notify(error); // defined in html page
    /* eslint-enable no-undef */
    // console.log(error);
    hideLoading();
  }
  hideLoading();
}

export async function geoSuccess(position) {
  const { coords } = position;
  await getWeatherDataAndRenderApp(coords.latitude, coords.longitude);
}

export async function geoError(error) {
  let errorMessage = '';
  switch (error.code) {
    case error.PERMISSION_DENIED:
      // 'It's not going to work unless you turn location services on, Eric';
      errorMessage = `
        <p class='message-alert-text-heading has-text-danger'>
          <i class='fas fa-fw fa-exclamation-triangle'></i> User denied the request for Geolocation
        </p>
        <p class='message-alert-text-first'>
          Please enable location services, clear any location tracking blocks for the domain
          'localweather.io' in your browser, and try again.
        </p>
      `;
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = `
        <p class='message-alert-text-heading has-text-danger'>
          <i class='fas fa-fw fa-exclamation-triangle'></i> POSITION UNAVAILABLE
        </p>
        <p class='message-alert-text-first'>
          Location information is unavailable.
        </p>
      `;
      break;
    case error.TIMEOUT:
      errorMessage = `
        <p class='message-alert-text-heading has-text-danger'>
          <i class='fas fa-fw fa-exclamation-triangle'></i> TIMEOUT
        </p>
        <p class='message-alert-text-first'>
          The request to get user location timed out.
        </p>
      `;
      break;
    case error.UNKNOWN_ERROR:
      errorMessage = `
        <p class='message-alert-text-heading has-text-danger'>
          <i class='fas fa-fw fa-exclamation-triangle'></i> UNKNOWN ERROR
        </p>
        <p class='message-alert-text-first'>
          An unknown error occurred.
        </p>
      `;
      break;
    default:
      break;
  }
  showErrorAlert(errorMessage);
}

export function initGeolocation() {
  if (!hasApprovedLocationSharing()) {
    if ('geolocation' in navigator) {
      try {
        populateAppShell();
        showLoading('... waiting for permission ...');
        document.cookie = 'approvedLocationSharing=true; expires=Fri, 31 Dec 9999 23:59:59 GMT';
        showLoading('... acquiring location ...');
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, defaults.geolocationOptions);
      } catch (error) {
        /* eslint-disable no-undef */
        bugsnagClient.notify(error); // defined in html page
        /* eslint-enable no-undef */
        // console.log(error);
        // TODO: Show friendly message to user
      }
    } else {
      showErrorAlert('GEOLOCATION_UNAVAILABLE: Geolocation is not available with your current browser.');
    }
  } else {
    showLoading('... acquiring location ...');
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, defaults.geolocationOptions);
  }
}
