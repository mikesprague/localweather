'use strict';

import tippy from 'tippy.js';
import swal from 'sweetalert2';
import * as defaults from './defaults';
import * as templates from './templates';

export function getMoonUi(data) {
  const averageLunarCycle = 29.53058867;
  const moonAge = Math.round(data.daily.data[0].moonPhase * averageLunarCycle);
  const iconPrefix = "wi-moon";
  let iconSuffix = "";
  let phaseText = "";
  if (moonAge > 0 && moonAge < 8) {
    iconSuffix = `waxing-crescent-${moonAge}`;
    phaseText = "Waxing Crescent";
  } else if (moonAge === 8) {
    iconSuffix = "first-quarter";
    phaseText = "First Quarter";
  } else if (moonAge > 8 && moonAge < 15) {
    iconSuffix = `waxing-gibbous-${moonAge - 8}`;
    phaseText = "Waxing Gibbous";
  } else if (moonAge === 15) {
    iconSuffix = "full";
    phaseText = "Full Moon";
  } else if (moonAge > 15 && moonAge < 22) {
    iconSuffix = `waning-gibbous-${moonAge - 15}`;
    phaseText = "Waning Gibbous";
  } else if (moonAge === 22) {
    iconSuffix = "third-quarter";
    phaseText = "Third Quarter";
  } else if (moonAge > 22 && moonAge < 29) {
    iconSuffix = `waning-crescent-${moonAge - 22}`;
    phaseText = "Waning Crescent";
  } else if (moonAge === 29 || moonAge === 0) {
    iconSuffix = "new";
    phaseText = "New Moon";
  }
  return {
    "icon": `${iconPrefix}-${iconSuffix}`,
    "phase": phaseText,
  };
}

export function getTempTrend(data) {
  const now = Math.round(new Date().getTime() / 1000);
  console.log(now);
  console.log(data.daily.data[0].apparentTemperatureHighTime)
  let iconClass = 'fal fa-fw fa-long-arrow-alt-down';
  let iconTransform = 'rotate--30';
  let tempTrendText = 'falling';
  if (now < data.daily.data[0].apparentTemperatureHighTime) {
    iconClass = 'fal fa-fw fa-long-arrow-alt-up';
    iconTransform = 'rotate-45';
    let tempTrendText = 'rising';
  }
  return {
    icon: `<i class="${iconClass}" data-fa-transform="${iconTransform}"></i>`,
    iconClass: iconClass,
    text: tempTrendText,
  };
}

export function getBodyBgClass(data) {
  const now = Math.round(new Date().getTime() / 1000);
  const sunrise = data.daily.data[0].sunriseTime;
  const sunset = data.daily.data[0].sunsetTime;
  const timeBuffer = 30 * 60; // 30 minutes
  const cloudCover = Math.round(data.currently.cloudCover * 100);
  const currentIcon = data.currently.icon;
  const isCloudy = cloudCover > 50;
  const isRaining = (currentIcon === 'rain' || currentIcon === 'thunderstorm');
  const isSnowing = (currentIcon === 'snow' || currentIcon === 'sleet');
  let bodyClassPrefix = 'night';
  let bodyClassSuffix = '';

  if (now >= sunrise + timeBuffer && now < sunset - timeBuffer) {
    bodyClassPrefix = 'day';
  } else if (now > sunrise - timeBuffer && now < sunrise + timeBuffer) {
    bodyClassPrefix = 'sunrise';
  } else if (now >= sunset - timeBuffer && now <= sunset + timeBuffer) {
    bodyClassPrefix = 'sunset';
  }
  bodyClassSuffix = isCloudy ? '-cloudy' : bodyClassSuffix;
  bodyClassSuffix = isRaining ? '-rain' : bodyClassSuffix;
  bodyClassSuffix = isSnowing ? '-snow' : bodyClassSuffix;

  return `${bodyClassPrefix}${bodyClassSuffix}`;
}

export function setBodyBgClass(className) {
  const bodyEl = document.querySelector('body');
  bodyEl.classList.add(className);
}

export function removeBodyBgClass(className) {
  const bodyEl = document.querySelector('body');
  bodyEl.classList.remove(className);
}

export function setFavicon(data) {
  const currentIcon = data.currently.icon;
  let iconTags = document.getElementsByClassName('favicon');
  const iconPath = `assets/images/favicons/${currentIcon}.png`;
  Array.from(iconTags).forEach(function (iconTag) {
    iconTag.setAttribute('href', iconPath);
  });
}

export function setTitle(data) {
  const newTitle = `${Math.round(data.currently.temperature)}° ${data.currently.summary} | ${defaults.title}`;
  window.document.title = newTitle;
}

export function showEl(el) {
  if (el !== 'undefined') {
    switch (typeof el) {
      case 'NodeList':
        Array.from(el).forEach(function (item) {
          item.classList.remove(defaults.hideClassName);
        });
        break;
      case 'object':
        if (el.length) {
          Array.from(el).forEach(function (item) {
            item.classList.remove(defaults.hideClassName);
          });
        } else {
          if (el.length !== 0) {
            el.classList.remove(defaults.hideClassName);
          }
        }
        break;
      case 'string':
        document.querySelector(el).classList.remove(defaults.hideClassName);
        break;
    }
  }
}

export function hideEl(el) {
  if (el !== 'undefined') {
    switch (typeof el) {
      case 'NodeList':
        Array.from(el).forEach(function (item) {
          item.classList.add(defaults.hideClassName);
        });
        break;
      case 'object':
        if (el.length) {
          Array.from(el).forEach(function (item) {
            item.classList.add(defaults.hideClassName);
          });
        } else {
          if (el.length !== 0) {
            el.classList.add(defaults.hideClassName);
          }
        }
        break;
      case 'string':
        document.querySelector(el).classList.add(defaults.hideClassName);
        break;
    }
  }
}

export function showLoading() {
  const loadingSpinner = document.querySelector(defaults.loadingSpinnerSelector);
  setBodyBgClass('loading');
  showEl(loadingSpinner);
  hideUi();
}

export function hideLoading() {
  const loadingSpinner = document.querySelector(defaults.loadingSpinnerSelector);
  removeBodyBgClass('loading');
  hideEl(loadingSpinner);
  showUi();
}

export function hideUi() {
  const rows = document.querySelectorAll('.weather-data .row');
  const hrAll = document.getElementsByTagName('hr');
  const poweredBy = document.querySelector('.powered-by-dark-sky');
  hideEl(rows);
  hideEl(hrAll);
  hideEl(poweredBy);
}

export function showUi() {
  const rows = document.querySelectorAll('.weather-data .row');
  const hrAll = document.getElementsByTagName('hr');
  const poweredBy = document.querySelector('.powered-by-dark-sky');
  showEl(rows);
  showEl(hrAll);
  showEl(poweredBy);
  initTooltips();
}

export function reloadWindow() {
  window.location.reload(true);
}

export function showInstallAlert() {
  swal({
    title: `${defaults.appName}`,
    text: `Updated to Latest Version (${defaults.versionString})`,
    confirmButtonText: 'Reload to Use',
    type: 'success',
    onClose: () => {
      reloadWindow();
    }
  });
}

export function registerAlertClickHandler() {
  document.querySelector('.alert-message > .alert-close').addEventListener('click', function (event) {
    document.querySelector('.alert-message > .alert-close').removeEventListener('click', event);
    this.parentNode.remove();
  });
}

export function showAlert(
  msg,
  type = 'danger', // type: primary | secondary | info | success | warning | danger | light | dark
  icon = 'fas fa-fw fa-exclamation-triangle' // icon: any valid font awesome string
) {
  templates.populateAlertMessage(msg, type, icon);
}

export function initWeatherAlerts(data) {
  const weatherAlerts = data.alerts;
  for (let i = 0; i < weatherAlerts.length; i++) {
    let description = weatherAlerts[i].description.split("*")[0];
    let linkHtml = `
      <a href="${weatherAlerts[i].uri}" rel="noopener" target="_blank">
        Open full ${weatherAlerts[i].severity} <i class="far fa-fw fa-external-link"></i>
      </a>
    `;
    showAlert(`
      <span class="has-tooltip" title="${weatherAlerts[i].description}">
        <strong>${weatherAlerts[i].title}</strong> ${description}
      </span>
      <br><small>${linkHtml}</small>
    `);
  }
}

export function initTooltips() {
  tippy('.has-tooltip', {
    arrow: true,
    size: 'large',
    livePlacement: true,
    performance: true,
  });
}

export function renderAppWithData(data) {
  setBodyBgClass(getBodyBgClass(data));
  templates.populatePrimaryData(data);
  templates.populateWeatherData(data);
  templates.populateForecastData(data);
  templates.populateHourlyData(data);
  templates.populateLastUpdated(data);
  templates.populateLocation(data);
  templates.populateFooter();
  setFavicon(data);
  setTitle(data);
  initTooltips();
  initWeatherAlerts(data);
  return true;
}
