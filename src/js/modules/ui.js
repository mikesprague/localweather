"use strict";

import tippy from "tippy.js";
import swal from "sweetalert2";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faSpinner, faGlobe, faMapMarkerAlt, faExclamationTriangle, 
  faBan, faSignal, faLongArrowAltDown, faLongArrowAltUp, faExternalLinkAlt,
  faPlusSquare, faMinusSquare, faGlobeAfrica, faSyncAlt,
  faDewpoint, faHumidity, faWind, faSunrise, faSunset, faEye, faUmbrella, faSun, faCloud
} from "@fortawesome/pro-solid-svg-icons";
import {
  faTint, faCode, faThermometerHalf
} from "@fortawesome/pro-light-svg-icons";
import * as defaults from "./defaults";
import { getData, setData, useCache } from "./cache";
import { getLocationAndPopulateAppData } from "./data";
import {
  populateMessage,populateErrorMessage, populateAlertMessage, populateFooter, 
  populateForecastData, populateHourlyData, populateLastUpdated, populateLocation, 
  populatePrimaryData, populateWeatherData, populateWeatherAlert
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
  const isCloudy = cloudCover > 50;
  const isRaining = (currentIcon === "rain" || currentIcon === "thunderstorm");
  const isSnowing = (currentIcon === "snow" || currentIcon === "sleet");
  const bodyClassSuffix = (now < sunrise || now >= sunset) ? "-night" : "";
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

export function showLoading(loadingMsg = defaults.loadingText) {
  const loadingSpinner = document.querySelector(defaults.loadingSpinnerSelector);
  setBodyBgClass("loading");
  populateMessage(loadingMsg);
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

export function showErrorAlert(errorMessage, buttonText = "Reload to Try Again") {
  hideLoading();
  swal({
    title: `${defaults.appName}`,
    html: `${errorMessage}`,
    confirmButtonText: `${buttonText}`,
    confirmButtonColor: `${defaults.themeColor}`,
    type: "error",
    onClose: () => {
      reloadWindow();
    }
  });
}

export function showGeolocationAlert() {
  if (document.cookie.replace(/(?:(?:^|.*;\s*)approvedLocationSharing\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
    swal({
      title: `${defaults.appName}`,
      html: `
        <p class="message-alert-text-heading has-text-info">
          <i class="fas fa-fw fa-info-circle"></i> Location Services Required
        </p>
        <p class="message-alert-text-first">
          This application requires the use of location information,
          provided by your device and browser, to get accurate weather data.
        </p>
        <p class="message-alert-text">
          If this is your first visit you will be prompted to share your
          location with 'localweather.io' - you must approve that request
          for this app to work.
        </p>
      `,
      confirmButtonText: `<i class='wi wi-fw wi-cloud-refresh'></i> Show me the Weather`,
      type: "info",
      onClose: () => {
        if ("geolocation" in navigator) {
          try {
            showLoading("... waiting for permission ...");
            document.cookie = "approvedLocationSharing=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            showLoading("... acquiring location ...");
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, defaults.geolocationOptions);
          } catch (error) {
            bugsnagClient.notify(error);
            // console.log(error);
            // TODO: Show friendly message to user
          }
        } else {
          showErrorAlert("GEOLOCATION_UNAVAILABLE: Geolocation is not available with your current browser.");
        }
      }
    });
  } else {
    showLoading("... acquiring location ...");
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, defaults.geolocationOptions);
  }
}

export function geoSuccess(position) {
  const coords = position.coords;
  getLocationAndPopulateAppData(coords.latitude, coords.longitude);
}

export function geoError(error) {
  let errorMessage = "";
  switch(error.code) {
    case error.PERMISSION_DENIED:
      // "It's not going to work unless you turn location services on, Eric";
      errorMessage = `
        <p class="message-alert-text-heading has-text-danger">
          <i class="fas fa-fw fa-exclamation-triangle"></i> User denied the request for Geolocation
        </p>
        <p class="message-alert-text-first">
          Please enable location services, clear any location tracking blocks for the domain
          'localweather.io' in your browser, and try again.
        </p>
      `;
      console.error(errorMessage);
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = `
        <p class="message-alert-text-heading has-text-danger">
          <i class="fas fa-fw fa-exclamation-triangle"></i> POSITION UNAVAILABLE
        </p>
        <p class="message-alert-text-first">
          Location information is unavailable.
        </p>
      `;
      break;
    case error.TIMEOUT:
      errorMessage = `
        <p class="message-alert-text-heading has-text-danger">
          <i class="fas fa-fw fa-exclamation-triangle"></i> TIMEOUT
        </p>
        <p class="message-alert-text-first">
          The request to get user location timed out.
        </p>
      `;
      break;
    case error.UNKNOWN_ERROR:
      errorMessage = `
        <p class="message-alert-text-heading has-text-danger">
          <i class="fas fa-fw fa-exclamation-triangle"></i> UNKNOWN ERROR
        </p>
        <p class="message-alert-text-first">
          An unknown error occurred.
        </p>
      `;
      break;
  }
  showErrorAlert(errorMessage);
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

export function showWeatherAlert(data) {
  swal({
    title: `${data[0].title}`,
    html: `
      <div class="has-text-left">
        <p>
          ${data[0].description}
          <br><br>
          <a href="${data[0].uri}" rel="noopener" target="_blank">View full ${data[0].severity} here</a>
        </p>
      </div>
    `,
    type: "warning"
  });
}

export function initWeatherAlerts(data) {
  const weatherAlerts = data.alerts;
  if (weatherAlerts) {
    populateWeatherAlert("Special Weather Statement");
    showEl(".weather-alert");
    document.querySelector(".link-weather-alert").addEventListener("click", clickEvent => {
      clickEvent.preventDefault();
      showWeatherAlert(weatherAlerts);
    });
  }
}

export function getWeatherIcon(icon) {
  const iconMap = [];
  iconMap["clear-day"] = "fal fa-fw fa-sun";
  iconMap["clear-night"] = "fal fa-fw fa-moon-stars";
  iconMap["rain"] = "fal fa-fw fa-cloud-rain";
  iconMap["snow"] = "fal fa-fw fa-cloud-snow";
  iconMap["sleet"] = "fal fa-fw fa-sleet";
  iconMap["wind"] = "fal fa-fw fa-wind";
  iconMap["fog"] = "fal fa-fw fa-fog";
  iconMap["cloudy"] = "fal fa-fw fa-clouds";
  iconMap["partly-cloudy-day"] = "fal fa-fw fa-clouds-sun";
  iconMap["partly-cloudy-night"] = "fal fa-fw fa-clouds-moon";
  iconMap["hail"] = "fal fa-fw fa-cloud-hail";
  iconMap["hurricane"] = "fal fa-fw fa-hurricane";
  iconMap["thunderstorm"] = "fal fa-fw fa-thunderstorm";
  iconMap["tornado"] = "fal fa-fw fa-tornado";
  return iconMap[`${icon}`];
}

export function initTooltips() {
  tippy(".has-tooltip", {
    allowHTML: true,
    arrow: true,
    livePlacement: true,
    size: "large",
    touch: true,
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
    faSyncAlt,
    faDewpoint, 
    faHumidity, 
    faWind, 
    faSunrise, 
    faSunset,
    faThermometerHalf
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
