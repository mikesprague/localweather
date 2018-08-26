"use strict";

import tippy from "tippy.js";
import swal from "sweetalert2";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faSpinner, faGlobe, faMapMarkerAlt, faExclamationTriangle, faTint, faUmbrella, faSun, faEye,
  faCloud, faBan, faCode, faSignal, faLongArrowAltDown, faLongArrowAltUp, faExternalLinkAlt,
  faPlusSquare, faMinusSquare
} from "@fortawesome/free-solid-svg-icons";
import * as defaults from "./defaults";
import { getData, setData, useCache } from "./cache";
import { getLocationAndPopulateAppData } from "./data";
import {
  populateAlertMessage, populateFooter, populateForecastData, populateHourlyData,
  populateLastUpdated, populateLocation, populatePrimaryData, populateWeatherData
} from "./templates";

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
  console.log(data.daily.data[0].apparentTemperatureHighTime);
  let iconClass = "fas fa-fw fa-long-arrow-alt-down";
  let iconTransform = "rotate--30";
  let tempTrendText = "falling";
  if (now < data.daily.data[0].apparentTemperatureHighTime) {
    iconClass = "fas fa-fw fa-long-arrow-alt-up";
    iconTransform = "rotate-45";
    let tempTrendText = "rising";
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
  const cloudCover = Math.round(data.currently.cloudCover * 100);
  const currentIcon = data.currently.icon;
  const isCloudy = cloudCover > 60;
  const isRaining = (currentIcon === "rain" || currentIcon === "thunderstorm");
  const isSnowing = (currentIcon === "snow" || currentIcon === "sleet");
  const bodyClassSuffix = (now >= sunset && now <= sunrise) ? "-night" : "";
  let bodyClassPrefix = "clear";
  bodyClassPrefix = isCloudy ? "cloudy" : bodyClassPrefix;
  bodyClassPrefix = isRaining ? "rainy" : bodyClassPrefix;
  bodyClassPrefix = isSnowing ? "snowy" : bodyClassPrefix;

  return `${bodyClassPrefix}${bodyClassSuffix}`;
}

export function setBodyBgClass(className) {
  const bodyEl = document.querySelector("body");
  const htmlEl = document.querySelector("html");
  bodyEl.classList.add(className);
  htmlEl.classList.add(className);
}

export function removeBodyBgClass(className) {
  const bodyEl = document.querySelector("body");
  const htmlEl = document.querySelector("html");
  bodyEl.classList.remove(className);
  htmlEl.classList.remove(className);
}

export function setFavicon(data) {
  const currentIcon = data.currently.icon;
  let iconTags = document.getElementsByClassName("favicon");
  const iconPath = `assets/images/favicons/${currentIcon}.png`;
  Array.from(iconTags).forEach((iconTag) => {
    iconTag.setAttribute("href", iconPath);
  });
}

export function setTitle(data) {
  const newTitle = `${Math.round(data.currently.temperature)}° ${data.currently.summary} | ${defaults.title}`;
  window.document.title = newTitle;
}

export function showEl(el) {
  if (el !== "undefined") {
    switch (typeof el) {
      case "NodeList":
        Array.from(el).forEach((item) => {
          item.classList.remove(defaults.hideClassName);
        });
        break;
      case "object":
        if (el.length) {
          Array.from(el).forEach((item) => {
            item.classList.remove(defaults.hideClassName);
          });
        } else {
          if (el.length !== 0) {
            el.classList.remove(defaults.hideClassName);
          }
        }
        break;
      case "string":
        document.querySelector(el).classList.remove(defaults.hideClassName);
        break;
    }
  }
}

export function hideEl(el) {
  if (el !== "undefined") {
    switch (typeof el) {
      case "NodeList":
        Array.from(el).forEach((item) => {
          item.classList.add(defaults.hideClassName);
        });
        break;
      case "object":
        if (el.length) {
          Array.from(el).forEach((item) => {
            item.classList.add(defaults.hideClassName);
          });
        } else {
          if (el.length !== 0) {
            el.classList.add(defaults.hideClassName);
          }
        }
        break;
      case "string":
        document.querySelector(el).classList.add(defaults.hideClassName);
        break;
    }
  }
}

export function showLoading() {
  const loadingSpinner = document.querySelector(defaults.loadingSpinnerSelector);
  setBodyBgClass("loading");
  showEl(loadingSpinner);
  hideUi();
  initFontAwesomeIcons();
}

export function hideLoading() {
  const loadingSpinner = document.querySelector(defaults.loadingSpinnerSelector);
  removeBodyBgClass("loading");
  hideEl(loadingSpinner);
  showUi();
  initFontAwesomeIcons();
}

export function hideUi() {
  const rows = document.querySelector(".weather-data");
  const hrAll = document.querySelectorAll("hr");
  hideEl(hrAll);
  hideEl(rows);
}

export function showUi() {
  const rows = document.querySelector(".weather-data");
  const hrAll = document.querySelectorAll("hr");
  showEl(rows);
  showEl(hrAll);
  initTooltips();
}

export function reloadWindow() {
  window.location.reload(true);
}

export function showInstallAlert() {
  swal({
    title: `${defaults.appName}`,
    text: "Latest Version Installed",
    confirmButtonText: "Reload to Activate",
    type: "success",
    onClose: () => {
      reloadWindow();
    }
  });
}

export function showGeolocationAlert() {
  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  if (!useCache(getData(defaults.cacheTimeKey))) {
    swal({
      title: `${defaults.appName}`,
      html: `
      <p class='text-left'>
        This application requires the use of location information
        provided by your device to get accurate weather data.
      </p>
      <p class='text-left'>
        If this is your first visit you will be asked to approve
        sharing your location before you can continue
      </p>
    `,
      confirmButtonText: `<i class='wi wi-fw wi-cloud-refresh'></i> Show me the Weather`,
      type: "info",
      onClose: () => {
        if ("geolocation" in navigator) {
          showLoading();
          navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
          // let watchPositionHandle = navigator.geolocation.watchPosition(geoSuccess, geoError);
        } else {
          Rollbar.critical("showGeolocationAlert: 'geolocation' not found in navigator");
          // console.error('ERROR: Your browser must support geolocation and you must approve sharing your location with the site for the app to work')
          // TODO: Show friendly message to user
        }
      }
    });
  } else {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }
}

export function geoSuccess(position) {
  const coords = position.coords;
  getLocationAndPopulateAppData(coords.latitude, coords.longitude);
}

export function geoError(error) {
  switch (error.code) {
    case error.TIMEOUT:
      // The user didn't accept the callout
      showGeolocationAlert();
      break;
    default:
      Rollbar.error("geoLocation error", error);
      break;
  }
}

export function registerAlertClickHandler() {
  // document.querySelector(".message-header > .delete").addEventListener("click", (event) => {
  document.querySelector(".message-header").addEventListener("click", (event) => {
    // document.querySelector(".message-header > .delete").removeEventListener("click", event);
    // this.parentNode.parentNode.remove();
    document.querySelector("article .message-body").classList.toggle(defaults.hideClassName);
    document.querySelector("article .message-header .icon svg").classList.toggle("fa-plus-square");
    document.querySelector("article .message-header .icon svg").classList.toggle("fa-minus-square");

  });
}

export function showAlert(
  title,
  msg,
  type = "danger", // type: primary | secondary | info | success | warning | danger | light | dark
  icon = "fas fa-fw fa-exclamation-triangle" // icon: any valid font awesome string
) {
  populateAlertMessage(title, msg, type, icon);
}

export function initWeatherAlerts(data) {
  const weatherAlerts = data.alerts;
  if (weatherAlerts) {
    for (let i = 0; i < weatherAlerts.length; i++) {
      // let linkHtml = `
      //   <a href="${weatherAlerts[i].uri}" rel="noopener" target="_blank">
      //     Open full ${weatherAlerts[i].severity} <i class="fas fa-fw fa-external-link"></i>
      //   </a>
      // `;
      showAlert(`${weatherAlerts[i].title}`, `${weatherAlerts[i].description}`);
    }
  }
}

export function initTooltips() {
  tippy(".has-tooltip", {
    arrow: true,
    size: "large",
    livePlacement: true,
    performance: true,
  });
}

export function initFontAwesomeIcons() {
  library.add(
    faSpinner,
    faGlobe,
    faMapMarkerAlt,
    faUmbrella,
    faSun,
    faEye,
    faCloud,
    faExclamationTriangle,
    faTint,
    faLongArrowAltDown,
    faLongArrowAltUp,
    faExternalLinkAlt,
    faCode,
    faBan,
    faSignal,
    faPlusSquare,
    faMinusSquare,
    faGlobeAfrica,
    faSyncAlt
  );
  dom.watch();
}

export function renderAppWithData(data) {
  initFontAwesomeIcons();
  setBodyBgClass(getBodyBgClass(data));
  populatePrimaryData(data);
  populateWeatherData(data);
  populateForecastData(data);
  populateHourlyData(data);
  populateLastUpdated(data);
  populateLocation(data);
  populateFooter();
  setFavicon(data);
  setTitle(data);
  initTooltips();
  initWeatherAlerts(data);
  hideLoading();
  return true;
}
