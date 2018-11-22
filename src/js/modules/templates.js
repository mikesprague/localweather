"use strict";

import * as defaults from "./defaults";
import { getWeatherIcon, getMoonUi, registerAlertClickHandler } from "./ui";
import { parseLocationNameFromFormattedAddress } from "./data";
import { getData } from "./cache";
import {
  formatUnixTimeAsLocalString, formatUnixTimeForSun, getDayFromUnixTime, getHourAndPeriodFromUnixTime, getTimeFromUnixTime
} from "./datetime";

export function populateMessage(messageText) {
  const messageTemplate = `
    <div class="columns is-mobile">
      <div class="column">
        <div class="content has-text-centered">
          <i class="fas fa-fw fa-spinner fa-5x fa-pulse"></i>
          <p class="message-text">${messageText}</p>
        </div>
      </div>
    </div>
  `;
  const messageEl = document.querySelector(".loading-message");
  messageEl.innerHTML = messageTemplate;
}

export function populateErrorMessage(messageText) {
  const messageTemplate = `
    <div class="columns is-mobile">
      <div class="column">
        <div class="content has-text-centered">
          <i class="has-text-danger fas fa-fw fa-exclamation-triangle fa-5x"></i>
          <p class="message-text">${messageText}</p>
        </div>
      </div>
    </div>
  `;
  const messageEl = document.querySelector(".loading-message");
  messageEl.innerHTML = messageTemplate;
}

export function populateLocation(data) {
  const locationName = getData(defaults.locationNameDataKey);
  const locationTemplate = `
    <div class="column">
      <h1 class="title is-1 has-text-centered has-tooltip" data-tippy-content="
        <i class='fas fa-fw fa-globe'></i>
        <strong>${locationName}</strong>
        <br>
        <i class='fas fa-fw fa-map-marker-alt'></i>
        ${Math.fround(data.latitude).toFixed(4)},${data.longitude.toFixed(4)}
      ">${parseLocationNameFromFormattedAddress(locationName)}</h1>
    </div>
  `;
  const locationEl = document.querySelector(".location");
  locationEl.innerHTML = locationTemplate;
}

export function populatePrimaryData(data) {
  const currentConditionsTooltip = `
    <div class='primarySummaryWrapper'>
      <div class='columns is-mobile'>
        <div class='column'>
          <strong>NEXT HOUR</strong>
          <i class='${getWeatherIcon(data.minutely.icon)}'></i>
          ${Math.round(data.hourly.data[1].temperature)}&deg;
          <br>
          ${data.minutely.summary}
        </div>
      </div>
      <div class='columns is-mobile'>
        <div class='column'>
          <strong>TODAY</strong>
          <i class='${getWeatherIcon(data.daily.data[0].icon)}'></i>
          ${Math.round(data.daily.data[0].temperatureHigh)}&deg;/
          ${Math.round(data.daily.data[0].temperatureLow)}&deg;
          <br>
          ${data.daily.data[0].summary}
          <br>
          ${data.hourly.summary}
        </div>
      </div>
      <div class='columns is-mobile'>
        <div class='column'>
          <strong>NEXT 7 DAYS</strong>
          <i class='${getWeatherIcon(data.daily.icon)}'></i>
          <br>
          ${data.daily.summary}
        </div>
      </div>
    </div>
  `;
  const locationName = getData(defaults.locationNameDataKey);
  const primaryDataTemplate = `
    <div class="column is-one-quarter has-text-right current-icon">
      <i class="${getWeatherIcon(data.currently.icon)}"></i>
    </div>
    <div class="column is-half current-conditions">
      <div class="content has-text-centered">
        <h2 class="subtitle is-1 has-text-centered has-tooltip" data-tippy-content="${currentConditionsTooltip}">
          ${data.currently.summary}
        </h2>
      </div>
    </div>
    <div class="column is-one-quarter has-text-left current-temp">
      <span>${Math.round(data.currently.temperature)}&deg;</span>
    </div>
  `;
  const priamryDataEl = document.querySelector(".primary-conditions-data");
  priamryDataEl.innerHTML = primaryDataTemplate;
}

export function populateWeatherAlert(title) {
  const weatherAlertTemplate = `
    <div class="column has-text-centered">
      <h3 class="subtitle is-2 has-text-centered">
        <a href="#" class="text-color-danger link-weather-alert">
          <i class="fas fa-fw fa-exclamation-triangle"></i> ${title}
        </a>
      </h3>
    </div>
  `;
  const weatherAlertEl = document.querySelector(".weather-alert");
  weatherAlertEl.innerHTML = weatherAlertTemplate;
}

export function populateWeatherData(data) {
  const moonUi = getMoonUi(data);
  const weatherDataTemplate = `
    <div class="columns is-mobile is-vcentered">
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" data-tippy-content="Wind">
        <p>
          <i class="fas fa-fw fa-wind"></i>
          <br>
          <i class="wi wi-fw wi-wind from-${data.currently.windBearing}-deg"></i>${Math.round(data.currently.windSpeed)}mph
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" data-tippy-content="Precipitation">
        <p>
          <i class="fas fa-fw fa-umbrella"></i>
          <br>
          ${Math.round(data.currently.precipProbability * 100)}%
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" data-tippy-content="UV">
        <p>
          <i class="fas fa-fw fa-sun"></i>
          <br>
          ${Math.round(data.currently.uvIndex)}
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" data-tippy-content="Visibility">
        <p>
          <i class="fas fa-fw fa-eye"></i>
          <br>
          ${data.currently.visibility}mi
        </p>
      </div>
      <div class="column is-hidden-mobile has-text-centered has-tooltip" data-tippy-content="Cloud Cover">
        <p>
          <i class="fas fa-fw fa-cloud"></i>
          <br>
          ${Math.round(data.currently.cloudCover * 100)}%
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" data-tippy-content="Sunrise">
        <p>
          <i class="fas fa-fw fa-sunrise"></i>
          <br>
          ${formatUnixTimeForSun(data.daily.data[0].sunriseTime)}am
        </p>
      </div>
    </div>
    <div class="columns is-mobile is-vcentered">
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" data-tippy-content="Barometric Pressure">
        <p>
          <i class="fas fa-fw fa-tachometer"></i>
          <br>
          ${Math.round(data.currently.pressure)}mb</i>
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" data-tippy-content="Humidity">
        <p>
          <i class="fas fa-fw fa-humidity"></i>
          <br>
          ${Math.round(data.currently.humidity * 100)}%
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" data-tippy-content="Dew Point">
        <p>
          <i class="fas fa-fw fa-dewpoint"></i>
          <br>
          ${Math.round(data.currently.dewPoint)}&deg;</i>
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" data-tippy-content="Feels Like">
        <p>
          <i class="fal fa-fw fa-thermometer-half"></i>
          <br>
          ${Math.round(data.currently.apparentTemperature)}&deg;</i>
        </p>
      </div>
      <div class="column is-hidden-mobile has-text-centered has-tooltip" data-tippy-content="Moon">
        <p class="moon-phase">
          <i class="wi wi-fw ${moonUi.icon}"></i>
          <br>
          ${moonUi.phase}
        </p>
      </div>
      <div class="column is-one-fifth-mobile has-text-centered has-tooltip" data-tippy-content="Sunset">
        <p>
          <i class="fas fa-fw fa-sunset"></i>
          <br>${formatUnixTimeForSun(data.daily.data[0].sunsetTime)}pm
        </p>
      </div>
    </div>
  `;
  const weatherDataEl = document.querySelector(".current-weather-data");
  weatherDataEl.innerHTML = weatherDataTemplate;
}

export function populateForecastData(data, numDays = 7) {
  const forecastWrappers = `
    <div class="column is-mobile has-text-centered forecast-1 is-one-quarter-mobile"></div>
    <div class="column is-mobile has-text-centered forecast-2 is-one-quarter-mobile"></div>
    <div class="column is-mobile has-text-centered forecast-3 is-one-quarter-mobile"></div>
    <div class="column is-mobile has-text-centered forecast-4 is-one-quarter-mobile"></div>
    <div class="column is-mobile has-text-centered forecast-5 is-hidden-mobile"></div>
    <div class="column is-mobile has-text-centered forecast-6 is-hidden-touch"></div>
    <div class="column is-mobile has-text-centered forecast-7 is-hidden-touch"></div>
  `;
  const forecastWrappersEl = document.querySelector(".forecast-data");
  forecastWrappersEl.innerHTML = forecastWrappers;
  for (let i = 0; i < numDays; i++) {
    let next = i + 1;
    let forecastTemplate = `
      <p class="has-tooltip" data-tippy-content="${data.daily.data[next].summary}">
        <strong>${getDayFromUnixTime(data.daily.data[next].time)}</strong>
        <br>
        <i class="${getWeatherIcon(data.daily.data[next].icon)}"></i>
        <br>
        ${Math.round(data.daily.data[next].temperatureHigh)}&deg;/${Math.round(data.daily.data[next].temperatureLow)}&deg;
      </p>
    `;
    let forecastEl = document.querySelector(`.forecast-${next}`);
    forecastEl.innerHTML = forecastTemplate;
  }
}

export function populateHourlyData(data, numHours = 12) {
  const hourlyWrappers = `
    <div class="column has-text-centered hourly-1"></div>
    <div class="column has-text-centered hourly-2"></div>
    <div class="column has-text-centered hourly-3"></div>
    <div class="column has-text-centered hourly-4"></div>
    <div class="column has-text-centered hourly-5"></div>
    <div class="column has-text-centered hourly-6 is-hidden-mobile"></div>
    <div class="column has-text-centered hourly-7 is-hidden-mobile"></div>
    <div class="column has-text-centered hourly-8 is-hidden-touch"></div>
    <div class="column has-text-centered hourly-9 is-hidden-touch"></div>
    <div class="column has-text-centered hourly-10 is-hidden-touch"></div>
    <div class="column has-text-centered hourly-11 is-hidden-touch"></div>
    <div class="column has-text-centered hourly-12 is-hidden-touch"></div>
  `;
  const hourlyWrappersEl = document.querySelector(".hourly-data");
  hourlyWrappersEl.innerHTML = hourlyWrappers;
  for (let i = 0; i < numHours; i++) {
    let next = i + 1;
    let hourlyPopup = `
      <!-- more complete detail here -->
    `;
    let precipitationText = Math.floor(data.hourly.data[next].precipProbability * 100) ?
      `${Math.floor(data.hourly.data[next].precipProbability * 100)}% chance of ${data.hourly.data[next].precipType}` :
      "No precipitation";
    let hourlyTemplate = `
      <p class="has-tooltip" data-tippy-content="${data.hourly.data[next].summary}<br>${precipitationText}">
        <strong>${getHourAndPeriodFromUnixTime(data.hourly.data[next].time)}</strong>
        <br>
        <i class="${getWeatherIcon(data.hourly.data[next].icon)}"></i> ${Math.round(data.hourly.data[next].temperature)}&deg;
      </p>
    `;
    let hourlyEl = document.querySelector(`.hourly-${next}`);
    hourlyEl.innerHTML = hourlyTemplate;
  }
}

export function populateAlertMessage(title, msg, type, icon) {
  const alertMessageTemplate = `
    <article class="message is-${type}">
      <div class="message-header">
        <p><i class="${icon}"></i> ${title}</p>
        <span class="icon"><i class="fas fa-fw fa-plus-square"></i></span>
      </div>
      <div class="message-body">
        <p>${msg}</p>
      </div>
    </article>
  `;
  const alertContainer = document.querySelector(".alert-container");
  alertContainer.innerHTML = alertMessageTemplate;
  document.querySelector("article .message-body").classList.add(defaults.hideClassName);
  registerAlertClickHandler();
}

export function populateLastUpdated(data) {
  const lastUpdatedString = `
    Weather data cached at: ${formatUnixTimeAsLocalString(data.currently.time)}
    <br>
    Weather data is cached for 10 minutes.
    <br>
    Next data refresh available after:
    ${formatUnixTimeAsLocalString(data.currently.time + defaults.cacheTimeSpan)}
  `;
  const lastUpdatedTemplate = `
    <div class="column has-text-centered">
      <p class="last-updated has-tooltip" data-tippy-content="${lastUpdatedString}">
        Weather data last updated ${getTimeFromUnixTime(data.currently.time)}
      </p>
    </div>
  `;
  const lastUpdatedEl = document.querySelector(".last-updated-time");
  lastUpdatedEl.innerHTML = lastUpdatedTemplate;
}

export function populateFooter() {
  const footerTemplate = `
    <div class="column">
      <div class="content has-text-right">
        <a href="https://localweather.io" data-tippy-content="LocalWeather.io ${defaults.versionString}">
          LocalWeather.io ${defaults.versionString}
        </a>
      </div>
    </div>
    <div class="column">
      <div class="content has-text-centered">
        <a href="https://darksky.net/poweredby/" target="_blank" rel="noopener" data-tippy-content="Powered by Dark Sky">
          <i class="fal fa-tint"></i> Powered by Dark Sky
        </a>
      </div>
    </div>
    <div class="column">
      <div class="content has-text-left">
        <a href="https://github.com/mikesprague/local-weather/" rel="noopener" target="_blank" data-tippy-content="Coded by Michael Sprague">
          <i class="fal fa-code"></i> by Michael Sprague
        </a>
      </div>
    </div>
  `;
  const footerEl = document.querySelector(".powered-by-dark-sky");
  footerEl.innerHTML = footerTemplate;
}
