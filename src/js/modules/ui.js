import tippy from "tippy.js";
import swal from "sweetalert2";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faSpinner, faGlobe, faMapMarkerAlt, faExclamationTriangle, faArrowAltCircleDown, faArrowAltCircleUp,
  faBan, faSignal, faLongArrowAltDown, faLongArrowAltUp, faExternalLinkAlt, faCircle,
  faPlusSquare, faMinusSquare, faGlobeAfrica, faSyncAlt,faTachometer, faAngleUp, faChevronCircleUp,
  faDewpoint, faHumidity, faWind, faSunrise, faSunset, faEye, faUmbrella, faSun, faCloud, faThermometerHalf
} from "@fortawesome/pro-solid-svg-icons";
import {
  faTint, faCode,
  faSun as faSunLight, faMoonStars, faCloudRain, faCloudSnow, faCloudSleet, faWind as faWIndLight,
  faFog, faClouds, faCloudsSun, faCloudsMoon, faCloudHail, faHurricane, faThunderstorm, faTornado
} from "@fortawesome/pro-light-svg-icons";
import dayjs from "dayjs";
import * as defaults from "./defaults";
import { getData, setData, useCache } from "./cache";
import { getLocationAndPopulateAppData } from "./data";
import {
  populateMessage,populateErrorMessage, populateFooter, populateForecastData,
  populateHourlyData, populateLastUpdated, populateLocation,
  populatePrimaryData, populateWeatherData, populateWeatherAlert
} from "./templates";

export function getUnitLabel(unitType, units) {
  // ex: getUnityLabel("visibility", "si"); -> returns: ["km", "kilometers"]
  return defaults.unitLabels[unitType][units];
}

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
  swal.fire({
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
  swal.fire({
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
    swal.fire({
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

export function parseWeatherAlert(weatherAlert) {
  const alertParts = weatherAlert.split("*");
  const headingText = alertParts.shift().replace(/\.\.\./g, " ").trim();
  const descriptionText = alertParts.join(" ").trim();
  console.log(weatherAlert);
  console.log(alertParts);

  let bulletPoints = "";
  if (alertParts.length > 1) {
    bulletPoints = alertParts.filter(part => {
      return part.trim().length;
    }).map(part => {
      return `<li><strong>${part.replace("...", "</strong> ")}</li>`;
    }).join("\n");
  }

  return {
    heading: headingText,
    bodyText: descriptionText,
    bulletPoints: bulletPoints
  };
}

export function showWeatherAlert(data) {
  const { title, time, expires, description, uri, severity } = data[0];
  const { heading, bodyText, bulletPoints } = parseWeatherAlert(description);

  if (!bulletPoints.length) {
    bulletPoints = `<li><strong>DETAILS</strong> ${descriptionText}<br></li>`;
  }

  swal.fire({
    title: `${title}`,
    html: `
        <div class="content">
          <p class="weather-alert-heading has-text-left">${heading}</p>
          <ul class="weather-alert-bullets has-text-left">
            <li><strong>ISSUED</strong> ${dayjs.unix(time).format("dddd, MMMM D, YYYY at hh:mm:ss A")}</li>
            <li><strong>EXPIRES</strong> ${dayjs.unix(expires).format("dddd, MMMM D, YYYY at hh:mm:ss A")}</li>
            ${bulletPoints}
          </ul>
        </div>
    `,
    confirmButtonText: "Close",
    confirmButtonColor: `${defaults.themeColor}`,
  });
}

export function initWeatherAlerts(data) {
  const weatherAlerts = data.alerts;
  if (weatherAlerts) {
    populateWeatherAlert(weatherAlerts[0].title);
    showEl(".weather-alert");
    document.querySelector(".link-weather-alert").addEventListener("click", clickEvent => {
      clickEvent.preventDefault();
      showWeatherAlert(weatherAlerts);
    });
  }
}

export function getWeatherIcon(icon) {
  return defaults.iconMap[icon];
}

export function initTooltips() {
  tippy(".has-tooltip", {
    allowHTML: true,
    arrow: true,
    interactive: true,
    livePlacement: true,
    size: "large",
    touch: true,
    trigger: "click", // mouseenter
  });
}

export function initFontAwesomeIcons() {
  library.add(
    faAngleUp,
    faArrowAltCircleDown,
    faArrowAltCircleUp,
    faBan,
    faChevronCircleUp,
    faCircle,
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
    faThermometerHalf,
    faThunderstorm,
    faTint,
    faTornado,
    faUmbrella,
    faWind,
    faWIndLight
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
