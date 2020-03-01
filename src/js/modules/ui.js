import {
  faTint, faClock, faCode, faWifiSlash,
  faMoonStars, faCloudRain, faCloudSnow,
  faCloudSleet, faFog, faClouds, faCloudsSun,
  faCloudsMoon, faCloudHail, faHurricane, faThunderstorm, faTornado,
  faTemperatureHigh, faTemperatureLow,
  faSpinner, faGlobe, faMapMarkerAlt, faExclamationTriangle,
  faArrowAltCircleDown, faArrowAltCircleUp, faBan, faSignal,
  faLongArrowAltDown, faLongArrowAltUp, faExternalLinkAlt,
  faCircle, faPlusSquare, faMinusSquare, faGlobeAfrica, faSyncAlt,
  faTachometer, faAngleUp, faChevronCircleUp, faDewpoint, faHumidity,
  faWind, faSunrise, faSunset, faEye, faUmbrella, faSun, faCloud,
  faThermometerHalf, faInfoCircle,
} from '@fortawesome/pro-duotone-svg-icons';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import dayjs from 'dayjs';
import swal from 'sweetalert2';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { getData, resetData, setData } from './cache';
import { getWeatherData } from './data';
import * as defaults from './defaults';
import { handleError, reloadWindow } from './helpers';
import {
  populateMessage, populateForecastData, populateTempUnitsToggle,
  populateHourlyData, populateLastUpdated, populateLocation,
  populatePrimaryData, populateWeatherData, populateWeatherAlert,
  populateAppShell, errorTemplates,
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
  }
  if (moonAge === 8) {
    iconSuffix = 'first-quarter';
    phaseText = 'First Quarter';
  }
  if (moonAge > 8 && moonAge < 15) {
    iconSuffix = `waxing-gibbous-${moonAge - 8}`;
    phaseText = 'Waxing Gibbous';
  }
  if (moonAge === 15) {
    iconSuffix = 'full';
    phaseText = 'Full Moon';
  }
  if (moonAge > 15 && moonAge < 22) {
    iconSuffix = `waning-gibbous-${moonAge - 15}`;
    phaseText = 'Waning Gibbous';
  }
  if (moonAge === 22) {
    iconSuffix = 'third-quarter';
    phaseText = 'Third Quarter';
  }
  if (moonAge > 22 && moonAge < 29) {
    iconSuffix = `waning-crescent-${moonAge - 22}`;
    phaseText = 'Waning Crescent';
  }
  if (moonAge === 29 || moonAge === 0) {
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
  let iconClass = 'fad fa-fw fa-long-arrow-alt-down';
  let iconTransform = 'rotate--30';
  let tempTrendText = 'falling';
  if (now < data.daily.data[0].apparentTemperatureHighTime) {
    iconClass = 'fad fa-fw fa-long-arrow-alt-up';
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
  const newTitle = `${Math.round(data.currently.temperature)}° ${data.currently.summary} | ${getData(defaults.locationNameDataKey)} | ${defaults.title}`;
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

const fToC = (fTemp) => Math.round((fTemp - 32) * 0.5556);
const cToF = (cTemp) => Math.round((cTemp * 1.8) + 32);

export function initTooltips() {
  tippy('.has-tooltip', {
    allowHTML: true,
    arrow: true,
    interactive: true,
    touch: true,
    trigger: 'click', // mouseenter
    popperOptions: {
      placement: 'top',
      modifiers: [
        {
          name: 'flip',
          enabled: true,
          // options: {
          //   fallbackPlacements: ['top'],
          // },
        },
      ],
    },
    onMount() {
      const toFahrenheit = document.querySelector('#fc-toggle').checked;
      const currentUnits = getData(defaults.temperatureUnitsKey);
      const defaultUnits = getData(defaults.temperatureDefaultUnitsKey);
      const tempElsInTooltip = Array.from(document.querySelectorAll('.temperature'));
      if (currentUnits !== defaultUnits) {
        tempElsInTooltip.forEach((tempEl) => {
          if (toFahrenheit) {
            tempEl.innerHTML = cToF(parseInt(tempEl.textContent));
            tempEl.classList.remove('temperature');
            tempEl.classList.add('temperature-converted');
          } else {
            tempEl.innerHTML = fToC(parseInt(tempEl.textContent));
            tempEl.classList.remove('temperature');
            tempEl.classList.add('temperature-converted');
          }
        });
      }
    },
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

export function showInstallAlert() {
  swal.fire({
    title: `${defaults.appName}`,
    text: 'Latest Version Installed',
    confirmButtonText: 'Reload for Latest Updates',
    icon: 'success',
    onClose: () => {
      resetData();
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
    icon: 'error',
    onClose: () => {
      resetData();
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
    bulletPoints = alertParts.filter((part) => part.trim().length)
      .map((part) => `<li><strong>${part.replace('...', '</strong> ')}</li>`)
      .join('\n');
  }

  return {
    heading,
    bodyText,
    bulletPoints,
  };
}

export function showWeatherAlert(data) {
  const {
    title,
    time,
    expires,
    description,
  } = data[0];
  const {
    heading,
    bulletPoints,
  } = parseWeatherAlert(description);

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
  const { alerts: weatherAlerts } = data;
  if (weatherAlerts) {
    populateWeatherAlert(weatherAlerts[0].title);
    showEl('.weather-alert');
    document.querySelector('.link-weather-alert').addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault();
      showWeatherAlert(weatherAlerts);
    });
  }
}

export function toggleTempUnits(data) {
  const { flags } = data;
  const { units } = flags;
  const defaultUnit = units === 'us' ? 'fahrenheit' : 'celsius';
  const toFahrenheit = document.querySelector('#fc-toggle').checked;
  if (defaultUnit === 'fahrenheit' && toFahrenheit) {
    setData(defaults.temperatureUnitsKey, 'fahrenheit');
    reloadWindow();
  } else if (defaultUnit === 'celsius' && !toFahrenheit) {
    setData(defaults.temperatureUnitsKey, 'celsius');
    reloadWindow();
  } else {
    const tempEls = Array.from(document.querySelectorAll('.temperature'));
    setData(defaults.temperatureUnitsKey, toFahrenheit ? 'fahrenheit' : 'celsius');
    tempEls.forEach((tempEl) => {
      if (toFahrenheit) {
        tempEl.innerHTML = cToF(parseInt(tempEl.textContent));
        tempEl.classList.remove('temperature');
        tempEl.classList.add('temperature-converted');
      } else {
        tempEl.innerHTML = fToC(parseInt(tempEl.textContent));
        tempEl.classList.remove('temperature');
        tempEl.classList.add('temperature-converted');
      }
    });
  }
}

export function initTempUnitsToggle(data) {
  const { flags } = data;
  const { units } = flags;
  const defaultUnits = units === 'us' ? 'fahrenheit' : 'celsius';
  const tempUnitsToggle = document.querySelector('#fc-toggle');
  setData(defaults.temperatureUnitsKey, defaultUnits);
  setData(defaults.temperatureDefaultUnitsKey, defaultUnits);
  if (defaultUnits === 'fahrenheit') {
    tempUnitsToggle.checked = 'checked';
  }
  if (defaultUnits === 'celsius') {
    tempUnitsToggle.checked = '';
  }
  tempUnitsToggle.addEventListener('click', () => {
    toggleTempUnits(data);
  });
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
  populateTempUnitsToggle(data);
  setFavicon(data);
  setTitle(data);
  initTempUnitsToggle(data);
  initTooltips();
  initWeatherAlerts(data);
}

export async function getWeatherDataAndRenderApp(lat, lng) {
  showLoading('... loading weather data ...');
  try {
    const weatherData = await getWeatherData(lat, lng);
    renderAppWithData(weatherData);
    hideLoading();
  } catch (error) {
    showErrorAlert(errorTemplates.genericError);
    handleError(error);
  }
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
      errorMessage = errorTemplates.geolocationPermission;
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = errorTemplates.geolocationPosition;
      break;
    case error.TIMEOUT:
      errorMessage = errorTemplates.geolocationTimeout;
      break;
    case error.UNKNOWN_ERROR:
      errorMessage = errorTemplates.geolocationUnknown;
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
        showErrorAlert(errorTemplates.locationError);
        handleError(error);
      }
    } else {
      showErrorAlert(errorTemplates.geolocationUnavailable);
    }
  } else {
    const skipGeolocation = getData(defaults.skipGeolocationCheckKey);
    if (skipGeolocation) {
      const weatherData = getData(defaults.weatherDataKey);
      renderAppWithData(weatherData);
    } else {
      showLoading('... acquiring location ...');
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, defaults.geolocationOptions);
    }
  }
}
